import { DataLayer } from './DataLayer/DataLayer';
import { defaultTectonics, Tectonics } from './TerrainGen/Tectonics';
import { ElevationMetadata } from './TerrainGen/metadata';

export class WorldMap {
  static Layer = {
    Elevation: 'elevation',
    Hilliness: 'hilliness',
    Rain: 'rain',
    Town: 'town',
  } as const;

  dataLayers: { [key: string]: DataLayer } = {};

  metadata: {
    [WorldMap.Layer.Elevation]?: ElevationMetadata;
  } = {};

  tectonics: Tectonics = { ...defaultTectonics };
}
