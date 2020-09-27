import { DeepReadonly } from 'ts-essentials';

export type ItemClassInfo = {
  name: string;
  maxStackSize: number;
  value: number;
};

export const defaultItemClassInfo: DeepReadonly<ItemClassInfo> = {
  name: '',
  maxStackSize: 0,
  value: 0,
};
