import { EntityManager } from '0-engine';
import { DeepReadonly } from 'ts-essentials';
import { ItemClassDbCmpt } from '1-game-code/Items';
import { Selector } from '4-react-ecsal';

export const getItemClasses: Selector<DeepReadonly<ItemClassDbCmpt>> = (eMgr: EntityManager) => {
  const itemClassDbCmpt = eMgr.getUniqueCmpt(ItemClassDbCmpt);
  return itemClassDbCmpt;
};
