import { EntityManager } from '0-engine';
import { TownLocationsCmpt } from './TownLocationsCmpt';
import { createMerchant } from '../Merchant/createMerchant';

export const createTown = (name = 'unnamed'): number => {
  const eMgr = EntityManager.instance;
  const town = eMgr.CreateEntity(name);

  const townLocationsCmpt = eMgr.AddComponent(town, TownLocationsCmpt);

  const merchantShop = createMerchant("Blacksmith's");
  townLocationsCmpt.locationIds.push(merchantShop);

  const alchemistShop = createMerchant("Alchemist's");
  townLocationsCmpt.locationIds.push(alchemistShop);

  const guild = createMerchant('Guild');
  townLocationsCmpt.locationIds.push(guild);

  const marketplace = createMerchant('Marketplace');
  townLocationsCmpt.locationIds.push(marketplace);

  return town;
};
