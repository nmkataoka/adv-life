import { Vector2, Vector3 } from '8-helpers/math';
import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMap } from '../WorldMap';

/** Approximates the surface normal at a grid point by averaging 4 cross products. */
export function surfaceNormal(e: DataLayer, coord: Vector2, scale: number): Vector3 {
  if (e.name !== WorldMap.Layer.Elevation) {
    throw new Error(`Wrong layer ${e.name} passed to surface normal function.`);
  }
  const { x, y } = coord;

  if (y >= e.height - 1 || y < 1) {
    throw new Error(`Can't calculate surface normal for tile on map's top or bottom edge.`);
  }

  const e0 = e.at(x, y);

  const dir1 = new Vector3(0, 1, scale * (e.at(x, y + 1) - e0));
  const dir2 = new Vector3(1, 0, scale * (e.at(x + 1, y) - e0));
  const n = dir1.cross(dir2);

  const dir3 = new Vector3(0, -1, scale * (e.at(x, y - 1) - e0));
  const dir4 = new Vector3(-1, 0, scale * (e.at(x - 1, y) - e0));
  n.addMut(dir3.cross(dir4));

  n.addMut(dir2.cross(dir3));
  n.addMut(dir4.cross(dir1));

  // Note: I am using a different coordinate system from the original code so I have to flip my normal
  return n.multScalarMut(-1 / n.length());
}
