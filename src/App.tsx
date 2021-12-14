import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Container } from 'reactstrap';
import styled from 'styled-components';

import { Header } from 'components';
import { Colors } from 'styles';

import SearchPage from 'pages/SearchPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/GlobalOverride.css';

const Background = styled.div`
  background-color: ${Colors.GreyDark};
`;

const App = () => (
  <Background>
    <Header />
    <Container>
      <Router>
        <Switch>
          <Route exact path="/:filterCode" component={SearchPage} />
          <Route exact path="/" component={SearchPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </Container>
  </Background>
);

export default App;
