import { DataLayer } from './DataLayer/DataLayer';
import { defaultTectonics, Tectonics } from './TerrainGen/Tectonics';
import { ElevationMetadata } from './TerrainGen/metadata';
import { WorldMapLayer } from './DataLayer/WorldMapLayers';

export class WorldMap {
  dataLayers: Partial<Record<WorldMapLayer, DataLayer>> = {};

  metadata: {
    elevation?: ElevationMetadata;
  } = {};

  tectonics: Tectonics = { ...defaultTectonics };
}
