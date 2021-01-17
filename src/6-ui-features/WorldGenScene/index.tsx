import { getColor } from '6-ui-features/Theme';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Input } from '6-ui-features/DesignSystem';
import { Sidebar } from './Sidebar';
import { Map } from './Map';

export default function WorldGenScene(): JSX.Element {
  const [seed, setSeed] = useState('a wonderful life');
  return (
    <Page>
      <Header>
        <h1>World Generation</h1>
        <SeedLabel htmlFor="seed">Seed</SeedLabel>
        <Input id="seed" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} />
      </Header>
      <Sidebar seed={seed} />
      <Map />
    </Page>
  );
}

const Page = styled.div`
  background-color: ${getColor('black')};
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  color: ${getColor('white')};

  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 20em calc(100% - 20em);
  grid-template-areas:
    'header header'
    'sidebar map';
`;

const Header = styled.div`
  grid-area: header;

  padding: 1em 2em;
`;

const SeedLabel = styled.label`
  margin-right: 1em;
`;
