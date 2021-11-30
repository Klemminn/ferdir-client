import { Images, Layout } from 'components';
import React from 'react';
import { FaStar, FaTripadvisor } from 'react-icons/fa';
import styled from 'styled-components';

import { GroupedTrip } from 'types';
import { Colors } from 'styles';
import { DateUtils, MiscUtils, TextUtils } from 'utils';
import ExternalLink from './ExternalLink';

const Container = styled.div`
  margin: 1rem;
`;

const ResultRow = styled(Layout.Row)`
  background-color: ${Colors.GreyBackground};
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 3px 0 rgb(0 0 0 / 15%),
    0 1px 6px 0 rgb(0 0 0 / 10%);
`;

const ImageColumn = styled(Layout.Col)`
  padding: 0;
  max-height: 12rem;
`;

const ContentColumn = styled(Layout.Col)`
  display: flex;
  flex-direction: column;
`;

const PriceColumn = styled(ContentColumn)`
  justify-content: center;
`;

const ResultHeader = styled.div`
  font-size: 2rem;
  font-weight: 600;
`;

const ResultInfo = styled.div`
  margin-left: 1rem;
`;

const ResultInfoLine = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TripadvisorIcon = styled(FaTripadvisor)`
  font-size: 1rem;
  margin: 0 0.3rem;
`;

const StarsContainer = styled.div`
  margin-left: 0.5rem;
  margin-top: -0.2rem;
`;

type StarsProps = {
  stars: number;
};

const Stars: React.FC<StarsProps> = ({ stars }) => (
  <StarsContainer>
    {MiscUtils.getRangeArray(stars, 1).map((num) => (
      <FaStar key={num} />
    ))}
  </StarsContainer>
);

const AgencyContainer = styled(ExternalLink)`
  height: 3rem;
  margin: 0.5rem 1rem 0.5rem 0;
`;

const PriceContainer = styled.div`
  text-align: right;
  font-size: 0.8rem;
`;

type PriceTextProps = {
  isMain?: boolean;
};
const PriceText = styled.div<PriceTextProps>`
  font-weight: 600;
  font-size: ${({ isMain }) => `${isMain ? 2 : 1.5}rem`};
`;

type PriceProps = {
  label: string;
  price: number;
  isMain?: boolean;
};

const Price: React.FC<PriceProps> = ({ label, price, isMain }) => (
  <PriceContainer>
    <PriceText isMain={isMain}>{`${TextUtils.thousandSeparator(
      price,
    )}kr.`}</PriceText>
    {label}
  </PriceContainer>
);

const Result: React.FC<GroupedTrip & { isPackage?: boolean }> = ({
  isPackage,
  place,
  nights,
  imageSmall,
  hotel,
  stars,
  roomDescription,
  departureDate,
  returnDate,
  tripadvisorUrl,
  tripadvisorRating,
  price,
  pricePerPerson,
  agencies,
  url,
}) => (
  <ExternalLink href={url} noUnderline>
    <ResultRow>
      <ImageColumn md={3}>
        <Images.ThumbnailImage src={imageSmall} />
      </ImageColumn>
      <ContentColumn md={6}>
        <ResultHeader>{`${place} - ${nights} nætur`}</ResultHeader>
        <ResultInfo>
          <ResultInfoLine>
            {DateUtils.getTripDatesString(departureDate, returnDate)}
          </ResultInfoLine>
          {isPackage && (
            <>
              <ExternalLink href={tripadvisorUrl}>
                <ResultInfoLine>
                  {hotel}
                  <Stars stars={stars} />
                  <TripadvisorIcon />
                  {TextUtils.dotToComma(tripadvisorRating.toFixed(1))}
                </ResultInfoLine>
              </ExternalLink>
              <ResultInfoLine>{roomDescription}</ResultInfoLine>
              <ResultInfoLine>
                {agencies.map((agency) => (
                  <AgencyContainer href={agency.url}>
                    <Images.AgencyLogo src={agency.logo} />
                  </AgencyContainer>
                ))}
              </ResultInfoLine>
            </>
          )}
        </ResultInfo>
      </ContentColumn>
      <PriceColumn md={3}>
        <Price price={pricePerPerson} isMain label="per farþega" />
        <Price price={price} label="heildarverð" />
      </PriceColumn>
    </ResultRow>
  </ExternalLink>
);

type TripProps = {
  trip: GroupedTrip;
};

const Trip: React.FC<TripProps> = ({ trip }) => <Result isPackage {...trip} />;

type TripsProps = {
  trips: GroupedTrip[];
};

export const Trips: React.FC<TripsProps> = ({ trips }) => (
  <Container>
    {trips.map((trip) => (
      <Trip key={trip.id} trip={trip} />
    ))}
  </Container>
);

type FlightProps = {
  flight: GroupedTrip;
};

const Flight: React.FC<FlightProps> = ({ flight }) => <Result {...flight} />;

type FlightsProps = {
  flights: GroupedTrip[];
};

export const Flights: React.FC<FlightsProps> = ({ flights }) => (
  <Container>
    {flights.map((flight) => (
      <Flight key={flight.id} flight={flight} />
    ))}
  </Container>
);
