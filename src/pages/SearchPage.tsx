import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaGift, FaPlane } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Buttons, Inputs, Layout, Loader, Results, Tabs } from 'components';
import { Colors } from 'styles';
import { Agency, Place, GroupedTrip } from 'types';
import { AgencyService, PlaceService, TripService } from 'services';

import SloganImage from 'assets/palms-w-logo.png';
import {
  dotToComma,
  getRangeArray,
  getDate,
  capitalize,
  thousandSeparator,
  groupTripsByAgency,
} from 'utils';

const getMonthOptions = () => {
  const firstDayOfCurrentMonth = getDate().date(1);
  const monthOptions = getRangeArray(12).map((offset) => {
    const firstDayOfMonth = firstDayOfCurrentMonth.add(offset, 'month');
    return {
      label: capitalize(firstDayOfMonth.format('MMM YYYY')),
      value: firstDayOfMonth.format('YYYY-MM-DD'),
    };
  });
  return monthOptions;
};

const monthOptions = getMonthOptions();

const defaultTravelPeriod = [
  monthOptions[0].value,
  monthOptions[monthOptions.length - 1].value,
];

const nightOptions = getRangeArray(30, 1).map((i) => ({
  label: `${i}`,
  value: i,
}));

const priceOptions = getRangeArray(500).map((i) => {
  const thousands = i * 1000;
  return {
    label: thousandSeparator(thousands),
    value: thousands,
  };
});

const starOptions = getRangeArray(5, 1).map((i) => ({
  label: `${i}`,
  value: i,
}));

const tripadvisorRatingOptions = getRangeArray(10, 0).map((i) => {
  const value = i / 2;
  return {
    label: dotToComma(value),
    value,
  };
});

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.White};
`;

const Slogan = styled.div`
  background-image: url(${SloganImage});
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  min-height: 28rem;
  display: flex;
  align-items: flex-end;

  .nav-tabs {
    margin-left: 1rem;
  }
`;

const ContentContainer = styled.div`
  margin: 1rem;
`;

const TabLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${Colors.BlackText};

  svg {
    margin-right: 0.5rem;
  }
`;

const ResultHeader = styled.div`
  margin: 2rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

const SearchPage = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceCodes, setSelectedPlaceCodes] = useState<Place['code'][]>(
    [],
  );
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyCodes, setSelectedAgencyCodes] = useState<
    Agency['code'][]
  >([]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState([7, 21]);
  const [prices, setPrices] = useState([0, 500000]);
  const [minimumStars, setMinimumStars] = useState(1);
  const [minimumTripadvisorRating, setMininumTripadvisorRating] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(defaultTravelPeriod[0]);
  const [dateTo, setDateTo] = useState(defaultTravelPeriod[1]);
  const [trips, setTrips] = useState<GroupedTrip[]>([]);
  const [hasMoreTrips, setHasMoreTrips] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([getPlaces(), getAgencies()]);
      getTrips();
    };
    init();
    // eslint-disable-next-line
  }, []);

  const getPlaces = async () => {
    const response = await PlaceService.getPlaces();
    setPlaces(response);
  };

  const getAgencies = async () => {
    const response = await AgencyService.getAgencies();
    setAgencies(response);
  };

  const getTrips = async (nextPage?: boolean) => {
    const currentPage = nextPage ? page + 1 : 1;
    setPage(currentPage);
    const response = await TripService.getTrips({
      adults,
      children,
      agencies: selectedAgencyCodes,
      dateFrom,
      dateTo,
      minStars: minimumStars,
      minTripadvisor: minimumTripadvisorRating,
      nightsFrom: nights[0],
      nightsTo: nights[1],
      // orderBy: 'price',
      page: currentPage,
      places: selectedPlaceCodes,
      priceFrom: prices[0],
      priceTo: prices[1],
      search: searchText,
      specificDates: 0,
    });
    if (response.length) {
      const groupedTrips = groupTripsByAgency(response, nextPage ? trips : []);
      setTrips(groupedTrips);
      setHasMoreTrips(true);
    } else {
      if (!nextPage) {
        setTrips([]);
      }
      setHasMoreTrips(false);
    }
  };

  return (
    <PageContainer>
      <Slogan>
        <Tabs
          tabs={[
            {
              label: (
                <TabLabel>
                  <FaGift />
                  Pakkaferð
                </TabLabel>
              ),
              value: 'package',
            },
            {
              label: (
                <TabLabel>
                  <FaPlane />
                  Eingöngu flug
                </TabLabel>
              ),
              value: 'flight',
            },
          ]}
        />
      </Slogan>
      <ContentContainer>
        <Layout.Row>
          <Layout.Col md={4}>
            <Inputs.MultiSelect
              placeholder="Hvert sem er"
              label="Áfangastaðir"
              options={places.map((place) => ({
                label: `${place.name}`,
                value: place.code,
              }))}
              onChange={(selected) =>
                setSelectedPlaceCodes(selected as Place['code'][])
              }
            />
          </Layout.Col>
          <Layout.Col md={4}>
            <Inputs.IntegerSelect
              label="Fullorðnir"
              min={1}
              max={4}
              defaultValue={adults}
              onChange={setAdults}
            />
          </Layout.Col>
          <Layout.Col md={4}>
            <Inputs.IntegerSelect
              label="Börn"
              min={0}
              max={4}
              defaultValue={children}
              onChange={setChildren}
            />
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col md={4}>
            <Inputs.Slider
              label="Ferðatímabil"
              options={monthOptions}
              defaultValue={defaultTravelPeriod}
              onChange={(value: string[]) => {
                setDateFrom(value[0]);
                setDateTo(value[1]);
              }}
            />
          </Layout.Col>
          <Layout.Col md={4}>
            <Inputs.Slider
              label="Nætur"
              options={nightOptions}
              defaultValue={nights}
              onChange={(selected) => setNights(selected as number[])}
            />
          </Layout.Col>

          <Layout.Col md={4}>
            <Inputs.Slider
              label="Verð á mann"
              options={priceOptions}
              defaultValue={prices}
              onChange={(selected) => setPrices(selected as number[])}
            />
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col md={4}>
            <Inputs.MultiSelect
              placeholder="Hver sem er"
              label="Ferðaskrifstofur"
              options={agencies.map((agency) => ({
                label: `${agency.name}`,
                value: agency.code,
              }))}
              onChange={(selected) =>
                setSelectedAgencyCodes(selected as Agency['code'][])
              }
            />
          </Layout.Col>
          <Layout.Col md={4}>
            <Inputs.Slider
              label="Hótel stjörnur"
              options={starOptions}
              defaultValue={minimumStars}
              onChange={(selected) => setMinimumStars(selected as number)}
            />
          </Layout.Col>
          <Layout.Col md={4}>
            <Inputs.Slider
              label="Tripadvisor einkunn"
              options={tripadvisorRatingOptions}
              defaultValue={minimumTripadvisorRating}
              onChange={(selected) =>
                setMininumTripadvisorRating(selected as number)
              }
            />
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col md={12}>
            <Inputs.Text
              label="Leit að hóteli eða herbergi"
              placeholder="Frjáls leit, t.d. allt innifalið, tvíbýli o.s.frv."
              onChange={setSearchText}
            />
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col md={3} />
          <Layout.Col md={6}>
            <Buttons.JumboButton color="primary" onClick={() => getTrips()}>
              Leita
            </Buttons.JumboButton>
          </Layout.Col>
        </Layout.Row>
        <ResultHeader>Ferðir í boði</ResultHeader>
        <InfiniteScroll
          dataLength={trips.length}
          next={() => getTrips(true)}
          hasMore={hasMoreTrips}
          loader={<Loader />}
        >
          <Results.Trips trips={trips} />
        </InfiniteScroll>
      </ContentContainer>
    </PageContainer>
  );
};

export default SearchPage;
