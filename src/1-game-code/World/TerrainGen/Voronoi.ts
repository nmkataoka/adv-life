import { Vector2 } from '8-helpers/math';
import { Delaunay, Voronoi } from 'd3-delaunay';
import { lessThan } from './lessThan';

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

  /** The indices of the edges for the cell for a given point. Indexed by point index. */
  pointsToEdges: number[][];

  /** The indices of the points (should always be 2) divided by a given edge. Indexed by edge index. */
  edgesToPoints: number[][];
  xSize: number;
  ySize: number;
};

/** Hashes a 2D point to a 1D integer (stringified) for easy sorting.
 * If points are too close together, hashes will collide.
 */
function hashPoint(point: Vector2, xMax: number, yMax: number): string {
  const [x, y] = point;
  const max = Math.max(xMax, yMax);
  const resolution = 1000000 / max;
  return Math.round((y * xMax + x) * resolution).toString();
}

function hashEdge(edge: Edge, xMax: number, yMax: number): string {
  let p1: Vector2;
  let p2: Vector2;

  // Points must be sorted so that hash([A, B]) === hash([B, A])
  if (lessThan(edge[0], edge[1])) {
    [p1, p2] = edge;
  } else {
    [p2, p1] = edge;
  }
  const hash1 = hashPoint(p1, xMax, yMax);
  const hash2 = hashPoint(p2, xMax, yMax);
  return `${hash1},${hash2}`;
}

/** Generates a voronoi diagram for the given number of points */
export function generateVoronoi(
  numPoints: number,
  xSize: number,
  ySize: number,
  // isCylindrical = true,
): VoronoiDiagram {
  // For isCylindrical maps, triplicate points (along x axis) and run graphing functions
  // At the end, the middle third will be used as the map
  // with edges wrapped around the sides
  const points = generateRandomPoints(numPoints, xSize, ySize);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, xSize, ySize]);

  const { edges, pointsToEdges, edgesToPoints } = linkPointsToEdges(voronoi, points, xSize, ySize);

  return {
    points,
    edges,
    pointsToEdges,
    edgesToPoints,
    xSize,
    ySize,
  };
}

/** Converts d3-delaunay's cellPolygon format to a more convenient format for us */
function linkPointsToEdges(
  voronoi: Voronoi<Delaunay.Point>,
  points: Vector2[],
  xSize: number,
  ySize: number,
) {
  const edges: Edge[] = [];
  const pointsToEdges: number[][] = [];

  /** Hash map created in order to identify edges, considering floating point issues.
   * If points are not separated by a minimum amount, will generate collisions.
   */
  const hashedEdgesToPointIndices: {
    [key: string]: { edgeIdx: number; pointIndices: number[] };
  } = {};

  for (let i = 0; i < points.length; ++i) {
    const cellPolygon = voronoi.cellPolygon(i);

    // d3-delaunay cell polygon is in [Point1, Point2, Point3] format
    // We want to convert it to [Edge, Edge, Edge] which is [[Point1, Point2], [Point2, Point3]]
    const cellEdges: number[] = [];
    for (let j = 1; j < cellPolygon.length; ++j) {
      const edge: Edge = [
        (cellPolygon[j - 1] as unknown) as Vector2,
        (cellPolygon[j] as unknown) as Vector2,
      ];
      const hash = hashEdge(edge, xSize, ySize);
      const edgeInfo = hashedEdgesToPointIndices[hash];
      if (!edgeInfo) {
        const edgeIdx = edges.length;
        hashedEdgesToPointIndices[hash] = { edgeIdx, pointIndices: [i] };
        cellEdges.push(edgeIdx);
        edges.push(edge);
      } else {
        edgeInfo.pointIndices.push(i);
        cellEdges.push(edgeInfo.edgeIdx);
      }
    }

    pointsToEdges.push(cellEdges);
  }

  const edgesToPoints = Object.values(hashedEdgesToPointIndices)
    .sort((a, b) => a.edgeIdx - b.edgeIdx)
    .map(({ pointIndices }) => pointIndices);

  return { edges, pointsToEdges, edgesToPoints };
}
