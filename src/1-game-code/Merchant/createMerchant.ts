import { EntityManager } from '0-engine';

import {
  InventoryCmpt,
  WearableCmpt,
  WieldableCmpt,
  ArmorType,
  WeaponType,
  ArmorTypeCmpt,
  WeaponTypeCmpt,
  ItemStackCmpt,
  MaterialDbCmpt,
  ItemClassDbCmpt,
} from '../ncomponents';

const createArmor = (
  eMgr: EntityManager,
  armorType: ArmorType,
  armorValue: number,
): ItemStackCmpt => {
  const wearable = new WearableCmpt();
  wearable.armorValue = armorValue;

  const armorTypeCmpt = new ArmorTypeCmpt();
  armorTypeCmpt.armorType = armorType;

  const materialDbCmpt = eMgr.getUniqueCmpt(MaterialDbCmpt);
  const itemClassDbCmpt = eMgr.getUniqueCmpt(ItemClassDbCmpt);

  const itemStack = new ItemStackCmpt();
  itemStack.itemClassId = itemClassDbCmpt.getIdFromName(armorType);
  itemStack.materialId = materialDbCmpt.getIdFromName('bronze');
  return itemStack;
};

const createWeapon = (
  eMgr: EntityManager,
  weaponType: WeaponType,
  damage: number,
): ItemStackCmpt => {
  const e = eMgr.createEntity('Sword');

  const wieldableCmpt = eMgr.addCmpt(e, WieldableCmpt);
  wieldableCmpt.damage = damage;

  const weaponTypeCmpt = eMgr.addCmpt(e, WeaponTypeCmpt);
  weaponTypeCmpt.weaponType = weaponType;

  const materialDbCmpt = eMgr.getUniqueCmpt(MaterialDbCmpt);
  const itemClassDbCmpt = eMgr.getUniqueCmpt(ItemClassDbCmpt);

  const itemStack = new ItemStackCmpt();
  itemStack.itemClassId = itemClassDbCmpt.getIdFromName('sword');
  itemStack.materialId = materialDbCmpt.getIdFromName('bronze');
  return itemStack;
};

const addItemToInventory = (
  inventory: InventoryCmpt,
  item: ItemStackCmpt,
  publicSalePrice: number,
) => {
  item.publicSalePrice = publicSalePrice;
  inventory.addItemToNextEmptySlot(item);
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

export const createMerchant = (name: string): number => {
  const eMgr = EntityManager.instance;
  const e = eMgr.createEntity(name);

  const inventory = eMgr.addCmpt(e, InventoryCmpt, 5);

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
