import { EntityManager } from '../../../0-engine/ECS/EntityManager';
import { Entity } from '../../../0-engine/ECS/Entity';
import {
  InventoryCmpt,
  WearableCmpt,
  WieldableCmpt,
  ArmorType,
  WeaponType,
  ArmorTypeCmpt,
  WeaponTypeCmpt,
  NameCmpt,
} from '../../ncomponents';

const createArmor = (
  eMgr: EntityManager,
  armorType: ArmorType,
  armorValue: number,
) => {
  const e = eMgr.CreateEntity();

  const wearable = new WearableCmpt();
  wearable.armorValue = armorValue;
  eMgr.AddComponent(e, wearable);

  const armorTypeCmpt = new ArmorTypeCmpt();
  armorTypeCmpt.armorType = armorType;
  eMgr.AddComponent(e, armorTypeCmpt);

  return e;
};

const createWeapon = (
  eMgr: EntityManager,
  weaponType: WeaponType,
  damage: number,
) => {
  const e = eMgr.CreateEntity();

  const wieldable = new WieldableCmpt();
  wieldable.damage = damage;
  eMgr.AddComponent(e, wieldable);

  const weaponTypeCmpt = new WeaponTypeCmpt();
  weaponTypeCmpt.weaponType = weaponType;
  eMgr.AddComponent(e, weaponTypeCmpt);

  return e;
};

const addItemToInventory = (inventory: InventoryCmpt, item: Entity, publicSalePrice: number) => {
  inventory.itemStacks.push({ itemIds: [item], publicSalePrice });
};

const armors = [
  { type: ArmorType.Boots, armorValue: 5, publicSalePrice: 750 },
  { type: ArmorType.Chainmail, armorValue: 11, publicSalePrice: 1700 },
  { type: ArmorType.Greaves, armorValue: 8, publicSalePrice: 1300 },
  { type: ArmorType.Helm, armorValue: 8, publicSalePrice: 1400 },
];

const weapons = [
  { type: WeaponType.Bow, damage: 10, publicSalePrice: 800 },
  { type: WeaponType.Spear, damage: 12, publicSalePrice: 1100 },
  { type: WeaponType.Sword, damage: 15, publicSalePrice: 1400 },
];

export const createMerchant = (name: string): Entity => {
  const eMgr = EntityManager.instance;
  const e = eMgr.CreateEntity();

  const nameCmpt = new NameCmpt();
  nameCmpt.name = name;
  eMgr.AddComponent(e, nameCmpt);

  const inventory = new InventoryCmpt();
  eMgr.AddComponent(e, inventory);

  armors.forEach(({ type, armorValue, publicSalePrice }) => {
    const armor = createArmor(eMgr, type, armorValue);
    addItemToInventory(inventory, armor, publicSalePrice);
  });

  weapons.forEach(({ type, damage, publicSalePrice }) => {
    const weapon = createWeapon(eMgr, type, damage);
    addItemToInventory(inventory, weapon, publicSalePrice);
  });

  return e;
};
