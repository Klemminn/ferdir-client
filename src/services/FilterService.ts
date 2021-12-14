import connector from './connector';

import { TripsFilter } from 'types';

export const createFilter = async (filter: TripsFilter): Promise<string> => {
  const { data } = await connector.post('/createFilter/', filter);
  return data;
};

export const getFilter = async (code: string): Promise<TripsFilter> => {
  const { data } = await connector.get(`/filter/${code}`);
  return data;
};
