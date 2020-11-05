import { EntityManager } from '0-engine';
import { ItemClassDbCmpt } from '1-game-code/Items';
import { Selector } from '4-react-ecsal';

export const getItemClasses: Selector<ItemClassDbCmpt> = (eMgr: EntityManager) => {
  const itemClassDbCmpt = eMgr.getUniqueCmpt(ItemClassDbCmpt);
  return itemClassDbCmpt;
};
