import { EntityManager } from '0-engine';

import {
  InventoryCmpt,
  WearableCmpt,
  WieldableCmpt,
  ArmorType,
  WeaponType,
  ArmorTypeCmpt,
  WeaponTypeCmpt,
  NameCmpt,
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

  const materialDbCmpt = eMgr.GetUniqueComponent(MaterialDbCmpt);
  const itemClassDbCmpt = eMgr.GetUniqueComponent(ItemClassDbCmpt);

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
  const e = eMgr.CreateEntity('Sword');

  const wieldable = new WieldableCmpt();
  wieldable.damage = damage;
  eMgr.AddComponent(e, wieldable);

  const weaponTypeCmpt = new WeaponTypeCmpt();
  weaponTypeCmpt.weaponType = weaponType;
  eMgr.AddComponent(e, weaponTypeCmpt);

  const materialDbCmpt = eMgr.GetUniqueComponent(MaterialDbCmpt);
  const itemClassDbCmpt = eMgr.GetUniqueComponent(ItemClassDbCmpt);

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
  const e = eMgr.CreateEntity();

  const nameCmpt = new NameCmpt();
  nameCmpt.name = name;
  eMgr.AddComponent(e, nameCmpt);

  const inventory = new InventoryCmpt(5);
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
