export type TownInfo = {
  townId: number;
  locationIds: number[];
  name: string;
}

export type TownsDict = {
  [key: string]: TownInfo;
}
