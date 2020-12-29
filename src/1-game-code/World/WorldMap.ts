import { DataLayer } from './DataLayer';
import { defaultTectonics, Tectonics } from './TerrainGen/Tectonics';

export class WorldMap {
  static Layer = {
    Elevation: 'elevation',
  } as const;

  dataLayers: { [key: string]: DataLayer } = {};

  tectonics: Tectonics = { ...defaultTectonics };
}
