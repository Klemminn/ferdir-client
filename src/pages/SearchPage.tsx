import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FaGift, FaPlane } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory, useParams } from 'react-router-dom';

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
import { Agency, Place, GroupedTrip, TripsFilter, FlightsFilter } from 'types';
import {
  AgencyService,
  FilterService,
  PlaceService,
  TripService,
} from 'services';

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

const defaultState: FlightsFilter | TripsFilter = {
  adults: 2,
  children: 0,
  nightsFrom: 7,
  nightsTo: 21,
  priceFrom: 0,
  priceTo: 500000,
  minStars: 1,
  minTripadvisor: 0,
  search: '',
  dateFrom: defaultTravelPeriod[0],
  dateTo: defaultTravelPeriod[1],
  agencies: [] as Agency['code'][],
  places: [] as Place['code'][],
  specificDates: 0 as 0 | 1,
};

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

type RouteParams = {
  filterCode: string;
};

const SearchPage = () => {
  const [isPackage, setIsPackage] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceCodes, setSelectedPlaceCodes] = useState(
    defaultState.places,
  );
  const [isReady, setIsReady] = useState(false);
  const pageRef = useRef(1);
  const [flightPlaces, setFlightPlaces] = useState<Place[]>([]);
  const [selectedFlightPlaceCodes, setSelectedFlightPlaceCodes] = useState(
    defaultState.places,
  );
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [search, setSearch] = useState(defaultState);

  const setSearchProp = (prop: keyof TripsFilter, value: any) =>
    setSearch({ ...search, [prop]: value });
  const [trips, setTrips] = useState<GroupedTrip[]>([]);
  const [flights, setFlights] = useState<GroupedTrip[]>([]);
  const [hasMoreTrips, setHasMoreTrips] = useState(false);
  const [loading, setLoading] = useState(true);

  const { filterCode }: RouteParams = useParams();
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      await Promise.all([getPlaces(), getAgencies()]);
      await applyFilter();
      setIsReady(true);
    };
    init();
    // eslint-disable-next-line
  }, []);

  const applyFilter = async () => {
    if (filterCode) {
      const filter = await FilterService.getFilter(filterCode);
      setSearch(filter);
      if (filter.isPackage) {
        setSelectedPlaceCodes(filter.places);
        getTrips(false, filter);
      } else {
        setSelectedFlightPlaceCodes(filter.places);
        await handleTabChange('flights', filter);
      }
    } else {
      getTrips();
    }
  };

  const handleTabChange = async (value: string, searchParams?: TripsFilter) => {
    const newIsPackage = value === 'package';
    setIsPackage(newIsPackage);
    if (!newIsPackage) {
      getFlights(false, searchParams);
      if (!flightPlaces.length) {
        await getFlightPlaces();
      }
    } else {
      getTrips();
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

  const handleUrlChange = async (searchParams: TripsFilter) => {
    const newFilterCode = await FilterService.createFilter(searchParams);
    history.push(`/${newFilterCode}`);
  };

  const handleSearchParams = (
    placeCodes: Place['code'][],
    nextPage?: boolean,
  ) => {
    const searchParams = {
      ...search,
      places: placeCodes,
      isPackage,
    };
    const filteredParams = isPackage
      ? searchParams
      : {
          ...searchParams,
          agencies: defaultState.agencies,
          search: defaultState.search,
          minStars: defaultState.minStars,
          minTripadvisor: defaultState.minTripadvisor,
        };
    handleUrlChange(filteredParams);
    return { ...filteredParams, page: updatePage(nextPage) };
  };

  const getTrips = async (nextPage?: boolean, searchParams?: TripsFilter) => {
    if (!nextPage) {
      setLoading(true);
    }
    const response = await TripService.getTrips(
      searchParams ?? handleSearchParams(selectedPlaceCodes),
    );
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

  const updatePage = (nextPage?: boolean) => {
    pageRef.current = nextPage ? pageRef.current + 1 : 1;
    return pageRef.current;
  };

  const getFlights = async (nextPage?: boolean, searchParams?: TripsFilter) => {
    if (!nextPage) {
      setLoading(true);
    }
    const response = await TripService.getFlights(
      searchParams ?? handleSearchParams(selectedFlightPlaceCodes),
    );
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
          defaultValue={isPackage ? 'package' : 'flight'}
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
      {isReady && (
        <ContentContainer>
          <Layout.Row>
            <Layout.Col md={4}>
              <Hidden shouldHide={!isPackage}>
                <Inputs.MultiSelect
                  placeholder="Hvert sem er"
                  label="Áfangastaðir"
                  defaultValue={search.places}
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
                  defaultValue={search.places}
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
                defaultValue={search.adults}
                onChange={(value) => setSearchProp('adults', value)}
              />
            </Layout.Col>
            <Layout.Col md={4}>
              <Inputs.IntegerSelect
                label="Börn"
                min={0}
                max={4}
                defaultValue={search.children}
                onChange={(value) => setSearchProp('children', value)}
              />
            </Layout.Col>
          </Layout.Row>
          <Layout.Row>
            <Layout.Col md={4}>
              <Inputs.Slider
                label="Ferðatímabil"
                options={monthOptions}
                defaultValue={[
                  search.dateFrom,
                  DateUtils.getIsoDate(
                    DateUtils.getStartOfMonth(search.dateTo),
                  ),
                ]}
                onChange={(value: string[]) =>
                  setSearch({
                    ...search,
                    dateFrom: value[0],
                    dateTo: DateUtils.getIsoDate(
                      DateUtils.getEndOfMonth(value[1]),
                    ),
                  })
                }
              />
            </Layout.Col>
            <Layout.Col md={4}>
              <Inputs.Slider
                label="Nætur"
                options={nightOptions}
                defaultValue={[search.nightsFrom, search.nightsTo]}
                onChange={(selected: number[]) =>
                  setSearch({
                    ...search,
                    nightsFrom: selected[0],
                    nightsTo: selected[1],
                  })
                }
              />
            </Layout.Col>
            <Layout.Col md={4}>
              <Inputs.Slider
                label="Verð á mann"
                options={priceOptions}
                defaultValue={[search.priceFrom, search.priceTo]}
                onChange={(selected: number[]) =>
                  setSearch({
                    ...search,
                    priceFrom: selected[0],
                    priceTo: selected[1],
                  })
                }
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
                  defaultValue={search.agencies}
                  onChange={(selected) => setSearchProp('agencies', selected)}
                />
              </Layout.Col>
              <Layout.Col md={4}>
                <Inputs.Slider
                  label="Hótel stjörnur"
                  options={starOptions}
                  defaultValue={search.minStars}
                  onChange={(selected) => setSearchProp('minStars', selected)}
                />
              </Layout.Col>
              <Layout.Col md={4}>
                <Inputs.Slider
                  label="Tripadvisor einkunn"
                  options={tripadvisorRatingOptions}
                  defaultValue={search.minTripadvisor}
                  onChange={(selected) =>
                    setSearchProp('minTripadvisor', selected)
                  }
                />
              </Layout.Col>
            </Layout.Row>
            <Layout.Row>
              <Layout.Col md={12}>
                <Inputs.Text
                  label="Leit að hóteli eða herbergi"
                  placeholder="Frjáls leit, t.d. allt innifalið, tvíbýli o.s.frv."
                  defaultValue={search.search}
                  onChange={(value) => setSearchProp('search', value)}
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
      )}
    </PageContainer>
  );
};

export default SearchPage;
