import { DeepReadonly } from 'ts-essentials';

export type TownInfo = {
  townId: number;
  locationIds: number[];
  name: string;
};

export const defaultTownInfo: DeepReadonly<TownInfo> = {
  townId: -1,
  locationIds: [],
  name: '',
};
