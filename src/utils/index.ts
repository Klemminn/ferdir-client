import dayjs from 'dayjs';

import { GroupedTrip, Trip } from 'types';

require('dayjs/locale/is');
dayjs.locale('is');

export const getDate = dayjs;

export const getTripDatesString = (
  departureDate: string,
  returnDate: string,
) => {
  const format = 'ddd. DD.MM.YYYY';
  const formattedDeparture = capitalize(getDate(departureDate).format(format));
  const formattedReturn = capitalize(getDate(returnDate).format(format));
  return `${formattedDeparture} - ${formattedReturn}`;
};

export const getRangeArray = (max: number, min: number = 0) => {
  return Array.from(new Array(max + 1 - min), (x, i) => i + min);
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const thousandSeparator = (str: number | string) => {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const dotToComma = (str: number | string) => {
  return str.toString().replace('.', ',');
};

export const groupTripsByAgency = (
  newTrips: Trip[],
  previousTrips: GroupedTrip[],
) => {
  const previousGrouped = [...previousTrips];
  const lastExisting = previousGrouped.pop();
  const initialTrips = lastExisting ? [lastExisting] : [];
  const newGrouped = newTrips.reduce((previous: GroupedTrip[], trip) => {
    const tripIdentifier = `${trip.hotelCode}.${trip.price}.${trip.departureDate}.${trip.nights}`;
    const sameTrip = previous.find(
      (groupedTrip) => groupedTrip.tripIdentifier === tripIdentifier,
    );
    if (sameTrip) {
      const alreadyAdded = sameTrip.agencies.find(
        (a) => a.agency === trip.agency,
      );
      if (!alreadyAdded) {
        sameTrip.agencies.push({
          agency: trip.agency,
          url: trip.url,
          logo: trip.agencyLogo,
        });
        sameTrip.url =
          1 / Math.random() > sameTrip.agencies.length
            ? trip.url
            : sameTrip.url;
      }
    } else {
      previous.push({
        ...trip,
        tripIdentifier,
        agencies: (trip as GroupedTrip).agencies ?? [
          { agency: trip.agency, url: trip.url, logo: trip.agencyLogo },
        ],
      });
    }
    return previous;
  }, initialTrips);

  return [...previousGrouped, ...newGrouped];
};
