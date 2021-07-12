import React from 'react';
import styled from 'styled-components';
import { Container } from 'reactstrap';

import HeaderLogo from 'assets/header-logo.svg';
import { Colors } from 'styles';

const FullHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 4rem;
  background-color: ${Colors.GreyLight};
`;

const Logo = styled.img`
  height: 3rem;
  margin-left: 1.5rem;
`;

const Header = () => (
  <FullHeader>
    <Container>
      <Logo src={HeaderLogo} />
    </Container>
  </FullHeader>
);

export default Header;
