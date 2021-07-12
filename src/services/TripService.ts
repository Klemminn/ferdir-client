import connector from './connector';

import { Agency, Place, Trip } from 'types';

type GetTripsParams = {
  adults: number;
  children: number;
  dateFrom: string;
  dateTo: string;
  minStars: number;
  minTripadvisor: number;
  nightsFrom: number;
  nightsTo: number;
  page: number;
  priceFrom: number;
  priceTo: number;
  specificDates: 0 | 1;
  agencies?: Agency['code'][];
  places?: Place['code'][];
  search?: string;
  orderBy?: 'price' | 'stars' | 'tripadvisor';
};

export const getTrips = async (params: GetTripsParams): Promise<Trip[]> => {
  const { data } = await connector.get(`/trips/`, { params });
  return data;
};
