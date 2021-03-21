import { DeepReadonly } from 'ts-essentials';

export type TownInfo = {
  readonly townId: number;
  readonly locationIds: DeepReadonly<number[]>;
  readonly name: string;
};

export const defaultTownInfo: DeepReadonly<TownInfo> = {
  townId: -1,
  locationIds: [],
  name: '',
} as const;
