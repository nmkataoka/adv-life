import styled from '@emotion/styled';
import { InventorySlotInfo } from '3-frontend-api/inventory/InventoryInfo';
import { DeepReadonly } from 'ts-essentials';
import ItemStack from './ItemStack';

type CharacterInventoryProps = {
  inventorySlots: DeepReadonly<(InventorySlotInfo | undefined)[]>;
};

const CharacterInventory = ({ inventorySlots }: CharacterInventoryProps): JSX.Element => {
  const filledInventorySlots = inventorySlots.filter(
    (slot) => typeof slot !== 'undefined',
  ) as DeepReadonly<InventorySlotInfo[]>;

  return (
    <RightHalf>
      <h3>Character Inventory</h3>
      <ItemRow>
        {filledInventorySlots.map(({ itemClassId }, idx) => {
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
