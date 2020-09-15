import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '../../7-app/types';
import CharacterInventory from '../CharacterInfo/CharacterInventory';
import { buyItemFromShop } from './townLocationsSlice';
import useUILoop from '../useUILoop';
import { updatePlayerInventoryFromEngine } from '../Player/playerSlice';

type ShopInventoryProps = {
  townLocationId: number;
};

const engineActions = [updatePlayerInventoryFromEngine];

const ShopInventory = ({ townLocationId }: ShopInventoryProps): JSX.Element => {
  const dispatch = useDispatch();
  useUILoop(engineActions);
  const inventory = useSelector((state: RootState) => state.townLocations.byId[townLocationId]?.inventory);
  const playerGold = useSelector((state: RootState) => state.player.inventory.gold);

  const handleBuyItem = (itemId: number) => () => {
    const item = inventory.inventorySlots.find(({ itemId: iid }) => itemId === iid);
    if (item) {
      const { publicSalePrice } = item;
      if (publicSalePrice < playerGold) {
        dispatch(buyItemFromShop({ itemId, sellerId: townLocationId, price: publicSalePrice }));
      }
    }
  };

  return (
    <TwoHalves>
      <VertFlexBox>
        {inventory.inventorySlots.map(({ itemId, name, publicSalePrice }) => (
          <ItemContainer key={itemId} onDoubleClick={handleBuyItem(itemId)}>
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
