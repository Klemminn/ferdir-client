import { GroupedTrip, Trip } from 'types';

export const getRangeArray = (max: number, min: number = 0) => {
  return Array.from(new Array(max + 1 - min), (x, i) => i + min);
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
        sameTrip.agencies.sort((a, b) => (a.agency > b.agency ? -1 : 1));
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
