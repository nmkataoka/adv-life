import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '../../7-app/types';

type ShopInventoryProps = {
  townLocationId: number;
}

export default function ShopInventory({ townLocationId }: ShopInventoryProps): JSX.Element {
  const inventory = useSelector((state: RootState) => state.townLocations.byId[townLocationId]?.inventory);

  return (
    <VertFlexBox>
      {inventory.inventorySlots.map(({ itemId, name, publicSalePrice }) => (
        <ItemContainer key={itemId}>
          <h4>{name}</h4>
          <h4>{`${publicSalePrice}g`}</h4>
        </ItemContainer>
      ))}
    </VertFlexBox>
  );
}

const ItemContainer = styled.div`
  border: 1px solid #c0c0c0;
  display: flex;
  justify-content: space-between;
  margin: 0.2em 0.4em;
  padding: 1em 0.5em;
`;

const VertFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
