import { Entity } from '0-engine';
import { InventoryCmpt } from '1-game-code/Inventory';
import { ItemStackCmpt } from '1-game-code/Items';
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
      inventorySlots: inventorySlots.map((slot: ItemStackCmpt | undefined) => {
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
