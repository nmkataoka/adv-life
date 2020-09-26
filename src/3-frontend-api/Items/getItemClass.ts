import { EntityManager } from '0-engine';
import { DeepReadonly } from 'ts-essentials';
import { ItemClassDbCmpt } from '1-game-code/Items';
import { Selector } from '4-react-ecsal';
import { getItemClasses } from './getItemClasses';
import { defaultItemClassInfo, ItemClassInfo } from './ItemClassInfo';

const getItemClassFromItemClasses = (itemClassId: number) => (
  itemClasses: DeepReadonly<ItemClassDbCmpt>,
) => {
  const { name, maxStackSize, value } = itemClasses.get(itemClassId);
  return { name, maxStackSize, value };
};

export const getItemClass = (itemClassId: number): Selector<ItemClassInfo> => (
  eMgr: EntityManager,
) => {
  if (itemClassId < 0) return defaultItemClassInfo;
  return getItemClassFromItemClasses(itemClassId)(getItemClasses(eMgr));
};
