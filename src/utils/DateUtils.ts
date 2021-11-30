import dayjs, { Dayjs } from 'dayjs';
import * as TextUtils from './TextUtils';

require('dayjs/locale/is');
dayjs.locale('is');

type Date = Dayjs | string | undefined;

export const getDate = dayjs;

export const getEndOfMonth = (date?: Date) => getDate(date).endOf('month');
export const getStartOfMonth = (date?: Date) => getDate(date).startOf('month');

export const getIsoDate = (date?: Date) => getDate(date).format('YYYY-MM-DD');

export const getTripDatesString = (
  departureDate: string,
  returnDate: string,
) => {
  const format = 'ddd. DD.MM.YYYY';
  const formattedDeparture = TextUtils.capitalize(
    getDate(departureDate).format(format),
  );
  const formattedReturn = TextUtils.capitalize(
    getDate(returnDate).format(format),
  );
  return `${formattedDeparture} - ${formattedReturn}`;
};
