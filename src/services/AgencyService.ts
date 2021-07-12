import connector from './connector';

import { Agency } from 'types';

export const getAgencies = async (): Promise<Agency[]> => {
  const { data } = await connector.get(`/agencies/`);
  return data;
};
