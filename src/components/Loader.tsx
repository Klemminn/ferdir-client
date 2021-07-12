import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSun } from 'react-icons/fa';

const SpinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  animation: ${SpinAnimation} 4s infinite linear;
  font-size: 4rem;
`;

const Spinner = styled(FaSun)``;

const Loader: React.FC = () => (
  <Container>
    <Spinner />
  </Container>
);

export default Loader;
