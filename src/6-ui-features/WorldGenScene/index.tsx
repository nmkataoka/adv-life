import { getColor } from '6-ui-features/Theme';
import styled from '@emotion/styled';
import React from 'react';
import { Sidebar } from './Sidebar';

export default function WorldGenScene(): JSX.Element {
  return (
    <Page>
      <Header>
        <h1>World Generation</h1>
      </Header>
      <Sidebar />
      <Map>Map</Map>
    </Page>
  );
}

const Page = styled.div`
  background-color: ${getColor('black')};
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  color: ${getColor('white')};

  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 20em auto;
  grid-template-areas:
    'header header'
    'sidebar map';
`;

const Header = styled.div`
  grid-area: header;

  padding: 1em 2em;
`;

const Map = styled.div`
  grid-area: map;

  padding: 1em 2em;
`;
