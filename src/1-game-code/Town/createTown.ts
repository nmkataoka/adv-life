import { Entity, EntityManager } from '0-engine';
import { WorldMapLocationCmpt } from '1-game-code/World/WorldMapLocationCmpt';
import { TownLocationsCmpt } from './TownLocationsCmpt';
import { createMerchant } from '../Merchant/createMerchant';
import { RouteCmpt } from './RouteCmpt';

/**
 * Creates a town.
 * @param coords World map coordinates to place the town at.
 * @param name Name of the town.
 * @param fromTown Will automatically create a footpath road to the founding town.
 * @returns
 */
export const createTown = (
  coords: [number, number],
  name = 'unnamed',
  fromTown?: Entity,
): Entity => {
  const eMgr = EntityManager.instance;
  const town = eMgr.createEntity(name);

  const worldMapLocationCmpt = new WorldMapLocationCmpt();
  const [x, y] = coords;
  worldMapLocationCmpt.x = x;
  worldMapLocationCmpt.y = y;
  eMgr.addCmpt(town, worldMapLocationCmpt);

  if (fromTown) {
    const routeCmpt = new RouteCmpt();
    routeCmpt.townA = fromTown;
    routeCmpt.townB = town;
    const route = eMgr.createEntity();
    eMgr.addCmpt(route, routeCmpt);
  }

  const townLocationsCmpt = new TownLocationsCmpt();

  const merchantShop = createMerchant("Blacksmith's");
  townLocationsCmpt.locationIds.push(merchantShop);

  const alchemistShop = createMerchant("Alchemist's");
  townLocationsCmpt.locationIds.push(alchemistShop);

  const guild = createMerchant('Guild');
  townLocationsCmpt.locationIds.push(guild);

  const marketplace = createMerchant('Marketplace');
  townLocationsCmpt.locationIds.push(marketplace);

  eMgr.addCmpt(town, townLocationsCmpt);

  return town;
};
