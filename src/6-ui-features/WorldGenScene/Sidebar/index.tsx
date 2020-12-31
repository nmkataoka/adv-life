import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';
import { Tabs } from './Tabs';
import { TerrainGenControls } from './TerrainGenControls';

export function Sidebar(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('terrain');

  return (
    <Container>
      <Tabs selected={selectedTab} onChange={setSelectedTab} />
      <Content>
        <TerrainGenControls />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  grid-area: sidebar;

  padding: 1em 2em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Content = styled.div`
  border: 1px solid ${getColor('white')};
  border-top: 0;
  min-height: 20em;
  box-sizing: border-box;
  padding: 0.5em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
`;
