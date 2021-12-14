import connector from './connector';

import { FlightsFilter, Trip, TripsFilter } from 'types';

export const getTrips = async (params: TripsFilter): Promise<Trip[]> => {
  const { data } = await connector.get(`/trips/`, { params });
  return data;
};

export const getFlights = async (params: FlightsFilter): Promise<Trip[]> => {
  const { data } = await connector.get(`/flights/`, { params });
  return data;
};
