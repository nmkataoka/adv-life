import React from 'react';
import styled from '@emotion/styled';
import CharacterEquipment from './CharacterEquipment';
import CharacterInventory from './CharacterInventory';

const InventoryScreen = (): JSX.Element => (
  <Container>
    <TwoHalves>
      <CharacterEquipment />
      <CharacterInventory />
    </TwoHalves>
  </Container>
);

export default InventoryScreen;

const Container = styled.div`
  min-width: 70em;
`;

const TwoHalves = styled.div`
  align-items: stretch;  
  display: flex;
`;
