import connector from './connector';

import { Place } from 'types';

export const getPlaces = async (): Promise<Place[]> => {
  const { data } = await connector.get(`/places/`);
  return data;
};

export const getFlightPlaces = async (): Promise<Place[]> => {
  const { data } = await connector.get(`/flightPlaces/`);
  return data;
};
