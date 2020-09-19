import { Entity } from '../../0-engine';
import { EntityManager } from '../../0-engine';
import { TownLocationsCmpt, NameCmpt } from '../ncomponents';
import { createMerchant } from '../Merchant/createMerchant';

export const createTown = (name = 'unnamed'): Entity => {
  const eMgr = EntityManager.instance;
  const town = eMgr.CreateEntity();

  const nameCmpt = new NameCmpt();
  nameCmpt.name = name;
  eMgr.AddComponent(town, nameCmpt);

  const townLocationsCmpt = new TownLocationsCmpt();

  const merchantShop = createMerchant("Blacksmith's");
  townLocationsCmpt.locationIds.push(merchantShop);

  const alchemistShop = createMerchant("Alchemist's");
  townLocationsCmpt.locationIds.push(alchemistShop);

  const guild = createMerchant('Guild');
  townLocationsCmpt.locationIds.push(guild);

  const marketplace = createMerchant('Marketplace');
  townLocationsCmpt.locationIds.push(marketplace);

  eMgr.AddComponent(town, townLocationsCmpt);

  return town;
};
