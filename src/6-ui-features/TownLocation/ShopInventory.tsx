import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '7-app/types';
import CharacterInventory from '../CharacterInfo/CharacterInventory';
import { buyItemFromShop } from './townLocationsSlice';
import useUILoop from '../useUILoop';
import { updatePlayerInventoryFromEngine } from '../Player/playerSlice';
import ItemStack from './ItemStack';
import { updateItemClassesFromEngine } from '../Items/itemClassesSlice';

type ShopInventoryProps = {
  townLocationId: number;
};

const engineActions = [updatePlayerInventoryFromEngine];

const ShopInventory = ({ townLocationId }: ShopInventoryProps): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateItemClassesFromEngine());
  }, [dispatch]);
  useUILoop(engineActions);
  const inventory = useSelector(
    (state: RootState) => state.townLocations.byId[townLocationId]?.inventory,
  );
  const { inventorySlots, gold: playerGold } = useSelector(
    (state: RootState) => state.player.inventory,
  );

  const handleBuyItem = (itemIndex: number) => () => {
    const item = inventory.inventorySlots[itemIndex];
    if (item) {
      const { publicSalePrice } = item;
      if (publicSalePrice < playerGold) {
        dispatch(buyItemFromShop({ itemIndex, sellerId: townLocationId, price: publicSalePrice }));
      }
    }
  };

  return (
    <TwoHalves>
      <VertFlexBox>
        {inventory.inventorySlots
          .filter(({ stackCount }) => stackCount > 0)
          .map(({ itemClassId, publicSalePrice, stackCount }, itemIndex) => {
            // Inventory items are currently identified by index and otherwise may not be unique
            // eslint-disable-next-line react/no-array-index-key
            const key = `itemClass_${itemClassId}_${itemIndex}`;
            return (
              <ItemStack
                key={key}
                itemClassId={itemClassId}
                publicSalePrice={publicSalePrice}
                onDoubleClick={handleBuyItem(itemIndex)}
                stackCount={stackCount}
              />
            );
          })}
        <Gold>Gold: 1400g</Gold>
      </VertFlexBox>
      <CharacterInventory inventorySlots={inventorySlots} />
    </TwoHalves>
  );
};

export default ShopInventory;

const TwoHalves = styled.div`
  display: flex;
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
