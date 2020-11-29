import { DataLayer } from './DataLayer';

export class WorldMap {
  static Layer = {
    Elevation: 'elevation',
  } as const;

  dataLayers: { [key: string]: DataLayer } = {};
}
