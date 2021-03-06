import { useDispatch, useSelector2 } from '4-react-ecsal';
import styled from '@emotion/styled';
import { getInventory, getPlayerId, getPlayerInventory } from '3-frontend-api';
import { buyItemFromShop } from '2-backend-api/Shop/buyItemFromShop';
import CharacterInventory from '../CharacterInfo/CharacterInventory';
import ItemStack from './ItemStack';

type ShopInventoryProps = {
  townLocationId: number;
};

const ShopInventory = ({ townLocationId }: ShopInventoryProps): JSX.Element => {
  const dispatch = useDispatch();
  const buyerId = useSelector2(getPlayerId) ?? -1;
  const inventory = useSelector2(getInventory(townLocationId)) ?? { gold: 0, inventorySlots: [] };
  const { inventorySlots, gold: playerGold } = useSelector2(getPlayerInventory) ?? {
    inventorySlots: [],
    gold: 0,
  };

  const handleBuyItem = (itemIndex: number) => () => {
    const item = inventory.inventorySlots[itemIndex];
    if (item) {
      const { publicSalePrice } = item;
      if (publicSalePrice < playerGold) {
        void dispatch(buyItemFromShop({ itemIndex, buyerId, sellerId: townLocationId }));
      }
    }
  };

  return (
    <TwoHalves>
      <VertFlexBox>
        {inventory.inventorySlots
          .filter(({ stackCount }) => stackCount > 0)
          .map(({ itemClassId, publicSalePrice /* , stackCount */ }, itemIndex) => {
            // Inventory items are currently identified by index and otherwise may not be unique
            // eslint-disable-next-line react/no-array-index-key
            const key = `itemClass_${itemClassId}_${itemIndex}`;
            return (
              <ItemStack
                key={key}
                itemClassId={itemClassId}
                publicSalePrice={publicSalePrice}
                onDoubleClick={handleBuyItem(itemIndex)}
                // stackCount={stackCount}
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
