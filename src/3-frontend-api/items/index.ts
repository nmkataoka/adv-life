import { ItemClassDbCmpt } from '1-game-code/Items';
import { selectorNodeFamily, uniqueComponentNode, useSelector2 } from '4-react-ecsal';
import { defaultItemClassInfo, ItemClassInfo } from './ItemClassInfo';

const getItemClassDb = uniqueComponentNode(ItemClassDbCmpt);

export const getItemClass = selectorNodeFamily({
  get: (itemClassId: number) => ({ get }) => {
    if (itemClassId < 0) return defaultItemClassInfo;
    const [itemClassDbCmpt] = get(getItemClassDb);
    const itemClass = itemClassDbCmpt?.get(itemClassId);
    if (itemClass) {
      const { name, maxStackSize, value } = itemClass;
      return { name, maxStackSize, value };
    }
    return undefined;
  },
  computeKey: (itemClassId: number) => `${itemClassId}`,
});

export const useItemClass = (itemClassId: number): ItemClassInfo =>
  useSelector2(getItemClass(itemClassId)) ?? {
    name: 'Error',
    maxStackSize: 1,
    value: 0,
  };
