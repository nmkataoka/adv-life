import { NoiseParams } from '1-game-code/Noise';
import SimplexNoise from '10-simplex-noise';
import { Vector2 } from '8-helpers/math';
import { Fault } from '../Fault';

export function perturbPlateEdges(
  faults: Fault[],
  metersPerCoord: number,
  noiseParams: NoiseParams,
): void {
  const { scale, frequency, octaves, lacunarity, gain } = noiseParams;
  // Perturb edges into natural-looking faults that scale with world-size

  /** Length of segments, in tiles */
  const segmentLength = Math.floor(2.4);
  const faultNoiseScaling = scale;

  faults.forEach((fault) => {
    // Calculate edge unit-slope and its perpendicular
    const { length, unitVec, spansWorldSeam, vertices } = fault;
    let { normalDir } = fault;

    // Correction: if fault crosses the world seam, flip normalDir
    if (spansWorldSeam) {
      normalDir = normalDir.multScalar(-1);
    }

    // These settings control how the faults look
    const noise = new SimplexNoise('test', {
      frequency,
      octaves,
      lacunarity,
      gain,
    });

    // Calculate perturbations by
    //  1) Convert fault line into a circle
    //  2) Get noise for circle
    //  3) pick a point and set noise to zero, shift entire circle's noise
    //  4) convert back to line
    // This guarantees the perturbed faults still start and end in the same place
    //  so the plates are enclosed by faults, helping things like the floodfill algorithm
    const noiseCenter: Vector2 = fault.originalStart;
    const radius: Vector2 = new Vector2(length / 2, 0);
    const segmentLengthInRadians = (2 * Math.PI) / length;
    const { x: startingX, y: startingY } = noiseCenter.add(radius);
    const shift = noise.noise2D(startingX, startingY);
    const perturbedVertices: Vector2[] = [];
    // First (and last) point is hard-coded to ensure it doesn't move due to precision errors
    perturbedVertices.push(fault.originalStart);
    for (let d = 1; d < length; d += segmentLength) {
      const radTemp = radius.rotate(d * segmentLengthInRadians);
      const ptOnCircle = noiseCenter.add(radTemp);
      const perturbationMagnitude =
        faultNoiseScaling * (noise.noise2D(ptOnCircle.x, ptOnCircle.y) - shift);
      const perturbation = normalDir.multScalar(perturbationMagnitude);
      const newPoint: Vector2 = unitVec.multScalar(d).add(fault.originalStart).add(perturbation);
      perturbedVertices.push(newPoint);
    }
    // Last point is hard-coded to ensure it doesn't move due to precision errors
    perturbedVertices.push(vertices[vertices.length - 1]);

    fault.vertices = perturbedVertices;
  });
}
