import { Entity } from '0-engine';
import { InventoryCmpt } from '1-game-code/Inventory';
import { componentNode, ComponentNode, selectorNodeFamily } from '4-react-ecsal';
import { defaultInventorySlotInfo } from './InventoryInfo';

const getInventoryCmpt = (e: Entity): ComponentNode<InventoryCmpt> =>
  componentNode(InventoryCmpt, e);

export const getInventory = selectorNodeFamily({
  get: (e: Entity) => ({ get }) => {
    const [inventoryCmpt] = get(getInventoryCmpt(e));
    const { gold, inventorySlots } = inventoryCmpt ?? { gold: 0, inventorySlots: [] };
    return {
      gold,
      // $FIXME: Can remove `as any[]` in typescript 4.2
      inventorySlots: (inventorySlots as any[]).map((slot) => {
        if (!slot) {
          return { ...defaultInventorySlotInfo };
        }
        const { health, itemClassId, materialId, publicSalePrice, stackCount } = slot;
        return {
          health,
          itemClassId,
          materialId,
          publicSalePrice,
          stackCount,
        };
      }),
    };
  },
  computeKey: (e: Entity) => `${e}`,
});
