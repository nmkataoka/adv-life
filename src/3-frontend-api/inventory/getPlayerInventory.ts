import { Selector } from '4-react-ecsal';
import { EntityManager } from '0-engine';
import { getPlayerId } from '3-frontend-api/player';
import { getInventory } from './getInventory';
import { InventoryInfo } from './InventoryInfo';

export const getPlayerInventory: Selector<InventoryInfo> = (eMgr: EntityManager) =>
  getInventory(getPlayerId(eMgr))(eMgr);
