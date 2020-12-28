import { Vector2 } from '8-helpers/math';
import { Delaunay } from 'd3-delaunay';

/** Generates numPoints random 2D points in the range (0, xSize) and (y, ySize) */
function generateRandomPoints(numPoints: number, xSize: number, ySize: number): Vector2[] {
  const points: Vector2[] = [];
  for (let i = 0; i < numPoints; ++i) {
    points.push([Math.random() * xSize, Math.random() * ySize]);
  }
  return points;
}

export type Edge = [Vector2, Vector2];

export type Polygon = Edge[];

export type VoronoiDiagram = {
  points: Vector2[];
  edges: Edge[];

  /** The edges for the cell for a given point. Indexed by point index. */
  pointsToEdges: Polygon[];
  xSize: number;
  ySize: number;
};

/** Generates a voronoi diagram for the given number of points */
export function generateVoronoi(
  numPoints: number,
  xSize: number,
  ySize: number,
  isCylindrical = true,
): VoronoiDiagram {
  // For isCylindrical maps, triplicate points (along x axis) and run graphing functions
  // At the end, the middle third will be used as the map
  // with edges wrapped around the sides
  const points = generateRandomPoints(numPoints, xSize, ySize);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, xSize, ySize]);

  const {
    delaunay: { halfedges },
    circumcenters,
  } = voronoi;

  const edges: Edge[] = [];

  // Got this from d3-delaunay source code for voronoi.render()
  for (let i = 0, n = halfedges.length; i < n; ++i) {
    const j = halfedges[i];
    // eslint-disable-next-line no-continue
    if (j < i) continue;
    const ti = Math.floor(i / 3) * 2;
    const tj = Math.floor(j / 3) * 2;
    const xi = circumcenters[ti];
    const yi = circumcenters[ti + 1];
    const xj = circumcenters[tj];
    const yj = circumcenters[tj + 1];
    edges.push([
      [xi, yi],
      [xj, yj],
    ]);
  }

  const pointsToEdges: Polygon[] = [];
  for (let i = 0; i < points.length; ++i) {
    const cellPolygon = voronoi.cellPolygon(i);

    // d3-delaunay cell polygon is in [Point1, Point2, Point3] format
    // We want to convert it to [Edge, Edge, Edge] which is [[Point1, Point2], [Point2, Point3]]
    const cellEdges: Edge[] = [];
    for (let j = 1; j < cellPolygon.length; ++j) {
      cellEdges.push([
        (cellPolygon[j - 1] as unknown) as Vector2,
        (cellPolygon[j] as unknown) as Vector2,
      ]);
    }

    // Process the final edge
    cellEdges.push([
      (cellPolygon[cellPolygon.length - 1] as unknown) as Vector2,
      (cellPolygon[0] as unknown) as Vector2,
    ]);

    pointsToEdges.push(cellEdges);
  }

  return {
    points,
    edges,
    pointsToEdges,
    xSize,
    ySize,
  };
}
