import { GameManager } from '../../0-engine/GameManager';
import { ItemClassDbCmpt } from '../../1-game-code/Items';
import { ItemClassInfo } from './ItemClassInfo';

export const getItemClasses = (): ItemClassInfo[] => {
  const { eMgr } = GameManager.instance;
  const itemClassDbCmpt = eMgr.GetUniqueComponent(ItemClassDbCmpt);
  const itemClasses = itemClassDbCmpt?.getAll() ?? [];
  return itemClasses;
};
