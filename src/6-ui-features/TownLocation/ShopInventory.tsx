import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '../../7-app/types';
import CharacterInventory from '../CharacterInfo/CharacterInventory';

type ShopInventoryProps = {
  townLocationId: number;
}

const ShopInventory = ({ townLocationId }: ShopInventoryProps): JSX.Element => {
  const inventory = useSelector((state: RootState) => state.townLocations.byId[townLocationId]?.inventory);

  return (
    <TwoHalves>
      <VertFlexBox>
        {inventory.inventorySlots.map(({ itemId, name, publicSalePrice }) => (
          <ItemContainer key={itemId}>
            <h4>{name}</h4>
            <h4>{`${publicSalePrice}g`}</h4>
          </ItemContainer>
        ))}
        <Gold>Gold: 1400g</Gold>
      </VertFlexBox>
      <CharacterInventory />
    </TwoHalves>
  );
};

export default ShopInventory;

const TwoHalves = styled.div`
  display: flex;
`;

const ItemContainer = styled.div`
  border: 1px solid #c0c0c0;
  display: flex;
  justify-content: space-between;
  margin: 0.2em 0.4em;
  padding: 1em 0.5em;
`;

const VertFlexBox = styled.div`
  display: flex;
  flex: 0 0 40%;
  flex-direction: column;
  align-items: stretch;
`;

const Gold = styled.h4`
  padding-left: 0.5em;
`;
