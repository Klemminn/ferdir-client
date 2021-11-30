import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaGift, FaPlane } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  Buttons,
  Hidden,
  Inputs,
  Layout,
  Loader,
  Results,
  Tabs,
} from 'components';
import { Colors } from 'styles';
import { Agency, Place, GroupedTrip } from 'types';
import { AgencyService, PlaceService, TripService } from 'services';

import SloganImage from 'assets/palms-w-logo.png';
import { DateUtils, MiscUtils, TextUtils } from 'utils';

const getMonthOptions = () => {
  const firstDayOfCurrentMonth = DateUtils.getDate().startOf('month');
  const monthOptions = MiscUtils.getRangeArray(12).map((offset) => {
    const firstDayOfMonth = firstDayOfCurrentMonth.add(offset, 'month');
    return {
      label: TextUtils.capitalize(firstDayOfMonth.format('MMM YYYY')),
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

const nightOptions = MiscUtils.getRangeArray(30, 1).map((i) => ({
  label: `${i}`,
  value: i,
}));

const priceOptions = MiscUtils.getRangeArray(500).map((i) => {
  const thousands = i * 1000;
  return {
    label: TextUtils.thousandSeparator(thousands),
    value: thousands,
  };
});

const starOptions = MiscUtils.getRangeArray(5, 1).map((i) => ({
  label: `${i}`,
  value: i,
}));

const tripadvisorRatingOptions = MiscUtils.getRangeArray(10, 0).map((i) => {
  const value = i / 2;
  return {
    label: TextUtils.dotToComma(value),
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
  min-height: 80rem;
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
  const [isPackage, setIsPackage] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceCodes, setSelectedPlaceCodes] = useState<Place['code'][]>(
    [],
  );
  const [flightPlaces, setFlightPlaces] = useState<Place[]>([]);
  const [selectedFlightPlaceCodes, setSelectedFlightPlaceCodes] = useState<
    Place['code'][]
  >([]);
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
  const [flights, setFlights] = useState<GroupedTrip[]>([]);
  const [hasMoreTrips, setHasMoreTrips] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await Promise.all([getPlaces(), getAgencies()]);
      getTrips();
    };
    init();
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (value: string) => {
    const newIsPackage = value === 'package';
    setIsPackage(newIsPackage);
    if (!newIsPackage && !flightPlaces.length) {
      getFlightPlaces();
      getFlights();
    }
  };

  const getPlaces = async () => {
    const response = await PlaceService.getPlaces();
    setPlaces(response);
  };

  const getFlightPlaces = async () => {
    const response = await PlaceService.getFlightPlaces();
    setFlightPlaces(response);
  };

  const getAgencies = async () => {
    const response = await AgencyService.getAgencies();
    setAgencies(response);
  };

  const getTrips = async (nextPage?: boolean) => {
    if (!nextPage) {
      setLoading(true);
    }
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
      page: currentPage,
      places: selectedPlaceCodes,
      priceFrom: prices[0],
      priceTo: prices[1],
      search: searchText,
      specificDates: 0,
    });
    if (response.length) {
      const groupedTrips = MiscUtils.groupTripsByAgency(
        response,
        nextPage ? trips : [],
      );
      setTrips(groupedTrips);
      setHasMoreTrips(true);
    } else {
      if (!nextPage) {
        setTrips([]);
      }
      setHasMoreTrips(false);
    }
    setLoading(false);
  };

  const getFlights = async (nextPage?: boolean) => {
    if (!nextPage) {
      setLoading(true);
    }
    const currentPage = nextPage ? page + 1 : 1;
    setPage(currentPage);
    const response = await TripService.getFlights({
      adults,
      children,
      dateFrom,
      dateTo,
      nightsFrom: nights[0],
      nightsTo: nights[1],
      page: currentPage,
      places: selectedFlightPlaceCodes,
      priceFrom: prices[0],
      priceTo: prices[1],
      specificDates: 0,
    });
    if (response.length) {
      const groupedFlights = MiscUtils.groupTripsByAgency(
        response,
        nextPage ? flights : [],
      );
      setFlights(groupedFlights);
      setHasMoreTrips(true);
    } else {
      if (!nextPage) {
        setFlights([]);
      }
      setHasMoreTrips(false);
    }
    setLoading(false);
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
          onChange={(value) => handleTabChange(value)}
        />
      </Slogan>
      <ContentContainer>
        <Layout.Row>
          <Layout.Col md={4}>
            <Hidden shouldHide={!isPackage}>
              <Inputs.MultiSelect
                placeholder="Hvert sem er"
                label="Áfangastaðir"
                options={places.map((place) => ({
                  label: `${place.country} - ${place.name}`,
                  value: place.code,
                }))}
                onChange={(selected) =>
                  setSelectedPlaceCodes(selected as Place['code'][])
                }
              />
            </Hidden>
            <Hidden shouldHide={isPackage}>
              <Inputs.MultiSelect
                placeholder="Hvert sem er"
                label="Áfangastaðir"
                options={flightPlaces.map((place) => ({
                  label: `${place.country} - ${place.name}`,
                  value: place.code,
                }))}
                onChange={(selected) =>
                  setSelectedFlightPlaceCodes(selected as Place['code'][])
                }
              />
            </Hidden>
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
                setDateTo(
                  DateUtils.getIsoDate(DateUtils.getEndOfMonth(value[1])),
                );
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
        <Hidden shouldHide={!isPackage}>
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
        </Hidden>
        <Layout.Row>
          <Layout.Col md={3} />
          <Layout.Col md={6}>
            <Buttons.JumboButton
              color="primary"
              disabled={loading}
              onClick={() => (isPackage ? getTrips() : getFlights())}
            >
              Leita
            </Buttons.JumboButton>
          </Layout.Col>
        </Layout.Row>
        <ResultHeader>Lægstu verð síðustu 7 daga</ResultHeader>
        {loading ? (
          <Loader />
        ) : isPackage ? (
          !trips.length ? (
            <ResultHeader>Engar ferðir uppfylla valin skilyrði</ResultHeader>
          ) : (
            <InfiniteScroll
              dataLength={trips.length}
              next={() => getTrips(true)}
              hasMore={hasMoreTrips}
              loader={<Loader />}
            >
              <Results.Trips trips={trips} />
            </InfiniteScroll>
          )
        ) : !flights.length ? (
          <ResultHeader>Engar ferðir uppfylla valin skilyrði</ResultHeader>
        ) : (
          <InfiniteScroll
            dataLength={flights.length}
            next={() => getFlights(true)}
            hasMore={hasMoreTrips}
            loader={<Loader />}
          >
            <Results.Flights flights={flights} />
          </InfiniteScroll>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default SearchPage;
