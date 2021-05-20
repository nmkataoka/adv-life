import { Entity, EntityManager } from '0-engine';
import { TownLocationsCmpt } from './TownLocationsCmpt';
import { createMerchant } from '../Merchant/createMerchant';
import { RouteCmpt } from './RouteCmpt';
import { TownCmpt } from './TownCmpt';

/**
 * Creates a town.
 * @param civilizationId Entity id of the owning civilization.
 * @param coords World map coordinates to place the town at.
 * @param name Name of the town.
 * @param population The starting population.
 * @param fromTown Will automatically create a footpath road to the founding town.
 * @returns Entity id of the town.
 */
export const createTown = (
  eMgr: EntityManager,
  civilizationId: number,
  coords: [number, number],
  name = 'unnamed',
  fromTown?: Entity,
  population = 100,
): Entity => {
  const town = eMgr.createEntity(name);

  const townCmpt = new TownCmpt();
  townCmpt.civilizationId = civilizationId;
  townCmpt.coords = coords;
  townCmpt.population = population;
  eMgr.addCmpt(town, townCmpt);

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
