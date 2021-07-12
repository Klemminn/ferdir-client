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
  adults: number;
  children: number;
  agency: Agency['code'];
  agencyName: Agency['name'];
  agencyLogo: Agency['logo'];
  departureDate: string;
  hotel: string;
  hotelCode: number;
  hotelImage: string;
  hotelImageSmall: string;
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
