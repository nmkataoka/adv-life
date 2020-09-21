import React from 'react';
import styled from '@emotion/styled';
import { InventorySlotInfo } from '../../3-frontend-api/inventory/InventoryInfo';
import ItemStack from './ItemStack';

type CharacterInventoryProps = {
  inventorySlots: InventorySlotInfo[];
};

const CharacterInventory = ({ inventorySlots }: CharacterInventoryProps): JSX.Element => {
  return (
    <RightHalf>
      <h3>Character Inventory</h3>
      <ItemRow>
        {inventorySlots.map(({ itemClassId }, idx) => {
          // eslint-disable-next-line react/no-array-index-key
          return <ItemStack itemClassId={itemClassId} key={`itemClass_${itemClassId}_${idx}`} />;
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
