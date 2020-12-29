import { Fault } from './Fault';
import { TecPlate } from './TecPlate';

export type Tectonics = {
  height: number;
  width: number;
  numPlates: number;
  faults: Fault[];
  tecPlates: TecPlate[];
};

export const defaultTectonics = {
  numPlates: 0,
  faults: [],
  tecPlates: [],
  height: 0,
  width: 0,
};
