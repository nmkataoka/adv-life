import { DataLayer } from './DataLayer/DataLayer';
import { defaultTectonics, Tectonics } from './TerrainGen/Tectonics';

export class WorldMap {
  static Layer = {
    Elevation: 'elevation',
    Hilliness: 'hilliness',
    Rain: 'rain',
  } as const;

  dataLayers: { [key: string]: DataLayer } = {};

  tectonics: Tectonics = { ...defaultTectonics };
}
