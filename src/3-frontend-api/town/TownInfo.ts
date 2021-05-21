import { DeepReadonly } from 'ts-essentials';

export type TownInfo = {
  readonly townId: number;
  readonly locationIds: DeepReadonly<number[]>;
  readonly name: string;
  readonly coords: [number, number];
};

export const defaultTownInfo: DeepReadonly<TownInfo> = {
  townId: -1,
  locationIds: [],
  name: '',
  coords: [0, 0],
} as const;
