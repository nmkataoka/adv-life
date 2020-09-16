import React from 'react';
import styled from '@emotion/styled';
import { InventorySlotInfo } from '../../3-frontend-api/inventory/InventoryInfo';

type CharacterInventoryProps = {
  inventorySlots: InventorySlotInfo[];
};

const CharacterInventory = ({ inventorySlots }: CharacterInventoryProps): JSX.Element => {
  return (
    <RightHalf>
      <h3>Character Inventory</h3>
      <ItemRow>
        {inventorySlots.map(({ itemId, name }, idx) => {
          // eslint-disable-next-line react/no-array-index-key
          if (itemId < 0) return <ItemBox key={`empty${idx}`} />;
          return <ItemBox key={itemId}>{name}</ItemBox>;
        })}
      </ItemRow>
    </RightHalf>
  );
};

export default CharacterInventory;

const RightHalf = styled.div`
  flex: 1 1 50%;
  padding: 1em;
  text-align: center;
`;

const ItemRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const ItemBox = styled.div`
  align-items: center;
  border: 1px solid #c0c0c0;
  display: flex;
  height: 5em;
  justify-content: center;
  margin: 0.1em;
  width: 5em;
`;
