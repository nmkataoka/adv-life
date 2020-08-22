export type TownInfo = {
  id: number;
  locationIds: number[];
  name: string;
}

export type TownsDict = {
  [key: string]: TownInfo;
}
