import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import CharacterEquipment from './CharacterEquipment';
import CharacterInventory from './CharacterInventory';
import { RootState } from '../../7-app/types';

const InventoryScreen = (): JSX.Element => {
  const inventorySlots = useSelector((state: RootState) => state.player.inventory.inventorySlots);
  return (
    <Container>
      <TwoHalves>
        <CharacterEquipment />
        <CharacterInventory inventorySlots={inventorySlots} />
      </TwoHalves>
    </Container>
  );
};
export default InventoryScreen;

const Container = styled.div`
  min-width: 70em;
`;

const TwoHalves = styled.div`
  align-items: stretch;
  display: flex;
`;
