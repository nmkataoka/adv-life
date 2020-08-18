import { Entity } from '../../0-engine/ECS/Entity';
import { EntityManager } from '../../0-engine/ECS/EntityManager';
import { TownLocationsCmpt } from '../../1-ncomponents';
import { createMerchant } from '../Merchant/createMerchant';

export const createTown = (): Entity => {
  const eMgr = EntityManager.instance;
  const town = eMgr.CreateEntity();

  const townLocationsCmpt = new TownLocationsCmpt();

  const merchantShop = createMerchant("Blacksmith's");
  townLocationsCmpt.locations.push(merchantShop);

  const alchemistShop = createMerchant("Alchemist's");
  townLocationsCmpt.locations.push(alchemistShop);

  const guild = createMerchant('Guild');
  townLocationsCmpt.locations.push(guild);

  const marketplace = createMerchant('Marketplace');
  townLocationsCmpt.locations.push(marketplace);

  return town;
};
