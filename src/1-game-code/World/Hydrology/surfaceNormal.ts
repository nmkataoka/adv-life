import { Vector2 } from '8-helpers/math';
import { add, cross, multiply, norm, Vector3 } from '8-helpers/math/Vector3';
import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMap } from '../WorldMap';

/** Approximates the surface normal at a grid point by averaging 4 cross products. */
export function surfaceNormal(e: DataLayer, coord: Vector2, scale: number): Vector3 {
  if (e.name !== WorldMap.Layer.Elevation) {
    throw new Error(`Wrong layer ${e.name} passed to surface normal function.`);
  }
  const [x, y] = coord;
  const e0 = e.at(x, y);
  let n = cross([0, 1, scale * (e.at(x, y + 1) - e0)], [1, 0, scale * (e.at(x + 1, y) - e0)]);
  n = add(n, cross([0, -1, scale * (e.at(x, y - 1) - e0)], [-1, 0, scale * (e.at(x - 1, y) - e0)]));
  n = add(n, cross([1, 0, scale * (e.at(x + 1, y) - e0)], [0, -1, scale * (e.at(x, y - 1) - e0)]));
  n = add(n, cross([-1, 0, scale * (e.at(x - 1, y) - e0)], [0, 1, scale * (e.at(x, y + 1) - e0)]));
  // Note: I am using a different coordinate system from the original code so I have to flip my normal
  return multiply(n, -1 / norm(n));
}
