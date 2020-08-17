import React from 'react';
import styled from '@emotion/styled';
import TownLocation from './TownLocation';
import PartySummary from './PartySummary';

const locations = ["Blacksmith's", 'Guild', 'Marketplace', "Alchemist's"];

export default function TownScene(): JSX.Element {
  return (
    <Container>
      <MainContent>
        <PartySummary />
        <LocationContainer>
          {locations.map((name) => <TownLocation key={name} name={name} />)}
        </LocationContainer>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  min-height: 70vh;
  align-items: stretch;
`;

const MainContent = styled.div`
  flex: 1 1 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-content: center;
`;

const LocationContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: space-around;
`;
