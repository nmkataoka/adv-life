import { Vector2 } from '8-helpers/math';
import { Delaunay, Voronoi } from 'd3-delaunay';
import { subtract } from '8-helpers/math/Vector2';
import { createEdge, VorEdge } from './VorEdge';
import { compareEdges, lessThan } from '../lessThan';

/** Generates numPoints random 2D points in the range (0, xSize) and (y, ySize) */
function generateRandomPoints(numPoints: number, xSize: number, ySize: number): Vector2[] {
  const points: Vector2[] = [];
  for (let i = 0; i < numPoints; ++i) {
    points.push([Math.random() * xSize, Math.random() * ySize]);
  }
  return points;
}

export type Polygon = VorEdge[];

export type VoronoiDiagram = {
  points: Vector2[];
  edges: VorEdge[];

  xSize: number;
  ySize: number;
  isCylindrical: boolean;
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

function hashEdge(edge: VorEdge, xMax: number, yMax: number): string {
  let p1: Vector2;
  let p2: Vector2;

  // Points must be sorted so that hash([A, B]) === hash([B, A])
  if (lessThan(edge.start, edge.end) <= 0) {
    [p1, p2] = [edge.start, edge.end];
  } else {
    [p2, p1] = [edge.start, edge.end];
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
  isCylindrical = true,
): VoronoiDiagram {
  let points = generateRandomPoints(numPoints, xSize, ySize);

  // For isCylindrical maps, triplicate points (along x axis) and run graphing functions
  // At the end, the middle third will be used as the map
  // with edges wrapped around the sides
  if (isCylindrical) {
    const tmpPoints: Vector2[] = [...points];
    points.forEach(([x, y]) => tmpPoints.push([x + xSize, y]));
    points.forEach(([x, y]) => tmpPoints.push([x + 2 * xSize, y]));
    points = tmpPoints;
    xSize *= 3;
  }

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, xSize, ySize]);

  const { edges } = linkPointsToEdges(voronoi, points, xSize, ySize);

  let vor = { points, edges, xSize, ySize, isCylindrical };
  if (isCylindrical) {
    vor = wrapSides(vor);
  }

  return vor;
}

/** Converts d3-delaunay's cellPolygon format to a more convenient format for us. */
function linkPointsToEdges(
  voronoi: Voronoi<Delaunay.Point>,
  points: Vector2[],
  xSize: number,
  ySize: number,
) {
  const edges: VorEdge[] = [];

  /** Hash map created in order to identify edges, considering floating point issues.
   * If points are not separated by a minimum amount, will generate collisions.
   */
  const hashedEdgesToEdgeIdx: {
    [key: string]: number;
  } = {};

  for (let i = 0; i < points.length; ++i) {
    const cellPolygon = voronoi.cellPolygon(i);

    // d3-delaunay cell polygon is in [Point1, Point2, Point3] format
    // We want to convert it to [Edge, Edge, Edge] which is [[Point1, Point2], [Point2, Point3]]
    const cellEdges: number[] = [];
    for (let j = 1; j < cellPolygon.length; ++j) {
      const edge: VorEdge = createEdge(
        (cellPolygon[j - 1] as unknown) as Vector2,
        (cellPolygon[j] as unknown) as Vector2,
      );
      const hash = hashEdge(edge, xSize, ySize);
      let edgeIdx = hashedEdgesToEdgeIdx[hash];
      if (!edgeIdx) {
        edgeIdx = edges.length;
        hashedEdgesToEdgeIdx[hash] = edgeIdx;
        cellEdges.push(edgeIdx);
        edge.site1Idx = i;
        edges.push(edge);
      } else {
        edges[edgeIdx].site2Idx = i;
        cellEdges.push(edgeIdx);
      }
    }
  }

  edges.sort(compareEdges);

  return { edges };
}

/** For cylindrical maps, at the end we need to extract the middle third and handle the edges that wrap around */
function wrapSides(voronoi: VoronoiDiagram): VoronoiDiagram {
  const { points, edges, xSize, ySize, isCylindrical } = voronoi;

  // Points were triplicated for cylindrical voronoi, now we un-triplicate
  const newPoints = points.slice(0, points.length / 3);
  const newXSize = Math.floor(xSize / 3);

  // Find all edges that span the world seam
  const xStartBound = newXSize;
  const xEndBound = xStartBound * 2;

  // Skip first third (by x-axis) of points
  let eIdx = 0;
  while (edges[eIdx].start[0] < xStartBound) {
    ++eIdx;
    if (eIdx >= edges.length) {
      throw new Error('There was an issue in `wrapSides`');
    }
  }

  // Copy the second third
  const newEdges: VorEdge[] = [];
  while (eIdx < edges.length && edges[eIdx].start[0] < xEndBound) {
    if (spansXValue(edges[eIdx], xEndBound)) {
      edges[eIdx].spansWorldSeam = true;
    }
    newEdges.push(edges[eIdx]);
    ++eIdx;
  }

  // Move middle third into the original coordinate space
  newEdges.forEach((edge) => {
    edge.start = subtract(edge.start, [xStartBound, 0]);
    edge.end = subtract(edge.end, [xStartBound, 0]);

    // Make sure the site index is in bounds
    edge.site1Idx %= newPoints.length;
    edge.site2Idx %= newPoints.length;
  });

  return { edges: newEdges, points: newPoints, xSize: newXSize, ySize, isCylindrical };
}

function spansXValue(e: VorEdge, xValue: number): boolean {
  const {
    start: [startX],
    end: [endX],
  } = e;
  if (startX < xValue && endX > xValue) {
    // yCrossVal = (static_cast<double>(end.y) - start.y) / (end.x - start.x) * (xVal - start.x) + start.y;
    return true;
  }
  return false;
}
