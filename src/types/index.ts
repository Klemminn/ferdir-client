export type Place = {
  code: string;
  country: string;
  name: string;
};

export type FlightPlace = {
  code: string;
  country: string;
  name: string;
};

export type Agency = {
  code: string;
  name: string;
  logo: string;
};

export type Trip = {
  id: number;
  adults: number;
  children: number;
  agency: Agency['code'];
  agencyName: Agency['name'];
  agencyLogo: Agency['logo'];
  departureDate: string;
  hotel: string;
  hotelCode: number;
  image: string;
  imageSmall: string;
  place: Place['name'];
  price: number;
  pricePerPerson: number;
  returnDate: string;
  roomDescription: string;
  stars: number;
  nights: number;
  tripadvisorRating: number;
  tripadvisorUrl: string;
  url: string;
};

export type GroupedTrip = Trip & {
  tripIdentifier: string;
  agencies: {
    agency: Agency['code'];
    logo: Agency['logo'];
    url: Trip['url'];
  }[];
};

export type FlightsFilter = {
  adults: number;
  children: number;
  dateFrom: string;
  dateTo: string;
  nightsFrom: number;
  nightsTo: number;
  priceFrom: number;
  priceTo: number;
  specificDates: 0 | 1;
  agencies: Agency['code'][];
  places: Place['code'][];
  search?: string;
  orderBy?: 'price' | 'stars' | 'tripadvisor';
  page?: number;
  isPackage?: boolean;
};

export type TripsFilter = FlightsFilter & {
  minTripadvisor: number;
  minStars: number;
};
