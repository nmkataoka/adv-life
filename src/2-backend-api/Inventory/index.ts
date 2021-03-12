import { Entity, Thunk } from '0-engine';
import { holdItemFromInventory, wearItemFromInventory } from '1-game-code/Inventory/EquipmentSys';

export const holdItem = ({ userId, ...rest }: { itemIndex: number; userId: Entity }): Thunk => (
  dispatch,
) => dispatch(holdItemFromInventory({ ...rest, agentId: userId }));

export const wearItem = ({ userId, ...rest }: { itemIndex: number; userId: Entity }): Thunk => (
  dispatch,
) => dispatch(wearItemFromInventory({ ...rest, agentId: userId }));
