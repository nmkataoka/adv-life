export type TownInfo = {
  locationIds: number[];
  name: string;
}

export type TownsDict = {
  [key: string]: TownInfo;
}
