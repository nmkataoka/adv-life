import { Vector2 } from '8-helpers/math';
import { Delaunay, Voronoi } from 'd3-delaunay';

/**
 * Uses Lloyd's relaxation, which moves all points to the centroids of their voronoi cells.
 *
 * Returns new points list from which a new voronoi diagram can be generated.
 */
export function relax(
  points: Vector2[],
  vor: Voronoi<Delaunay.Point>,
  isCylindrical: boolean,
  xSize: number,
): Vector2[] {
  /**
   *  It could be more performant to modify the points list in place to reduce
   * stress on the garbage collector, and d3-delaunay supports this specific
   * use case, but let's skip that for now.
   */
  const newPoints: Vector2[] = [];
  if (isCylindrical) {
    // Points are triplicated, need to extract the middle third
    const oneThird = points.length / 3;
    for (let i = oneThird; i < 2 * oneThird; ++i) {
      const polygon = vor.cellPolygon(i);
      const centroid = getCentroidOfPolygon(polygon);
      newPoints.push(shiftPointIntoRange(centroid, xSize));
    }
  } else {
    points.forEach((_, i) => {
      const polygon = vor.cellPolygon(i);
      newPoints.push(getCentroidOfPolygon(polygon));
    });
  }

  return newPoints;
}

function getCentroidOfPolygon(polygon: Delaunay.Polygon): Vector2 {
  // Skip the first point since the d3-delaunay format repeats it at the end
  let xTotal = 0;
  let yTotal = 0;
  for (let j = 1; j < polygon.length; ++j) {
    const [x, y] = polygon[j];
    xTotal += x;
    yTotal += y;
  }
  const num = polygon.length - 1;
  return new Vector2(xTotal / num, yTotal / num);
}

/** shifts a point so its x-value is between [0, xSize) */
function shiftPointIntoRange(point: Vector2, xSize: number): Vector2 {
  const { x, y } = point;
  return new Vector2(((x % xSize) + xSize) % xSize, y);
}
