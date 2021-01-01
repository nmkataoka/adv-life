import SimplexNoise from '10-simplex-noise';
import { add, multiply, rotate, Vector2 } from '8-helpers/math/Vector2';
import { Fault } from '../Fault';

export function perturbPlateEdges(faults: Fault[], metersPerCoord: number): void {
  // Perturb edges into natural-looking faults that scale with world-size

  /** Length of segments, in tiles */
  const segmentLength = Math.floor(2.4);
  const faultNoiseScaling = 1700000 / metersPerCoord;

  faults.forEach((fault) => {
    // Calculate edge unit-slope and its perpendicular
    const { length, unitVec, spansWorldSeam, vertices } = fault;
    let { normalDir } = fault;

    // Correction: if fault crosses the world seam, flip normalDir
    if (spansWorldSeam) {
      normalDir = multiply(normalDir, -1);
    }

    // These settings control how the faults look
    const noise = new SimplexNoise('test', {
      frequency: 4.8 * 10 ** -8 * metersPerCoord,
      octaves: 10,
      lacunarity: 1.85,
      gain: 0.53,
    });

    // Calculate perturbations by
    //  1) Convert fault line into a circle
    //  2) Get noise for circle
    //  3) pick a point and set noise to zero, shift entire circle's noise
    //  4) convert back to line
    // This guarantees the perturbed faults still start and end in the same place
    //  so the plates are enclosed by faults, helping things like the floodfill algorithm
    const noiseCenter: Vector2 = fault.originalStart;
    const radius: Vector2 = [length / 2, 0];
    const segmentLengthInRadians = (2 * Math.PI) / length;
    const [startingX, startingY] = add(noiseCenter, radius);
    const shift = noise.noise2D(startingX, startingY);
    const perturbedVertices: Vector2[] = [];
    // First (and last) point is hard-coded to ensure it doesn't move due to precision errors
    perturbedVertices.push(fault.originalStart);
    for (let d = 1; d < length; d += segmentLength) {
      const radTemp = rotate(radius, d * segmentLengthInRadians);
      const ptOnCircle = add(noiseCenter, radTemp);
      const perturbationMagnitude =
        faultNoiseScaling * (noise.noise2D(ptOnCircle[0], ptOnCircle[1]) - shift);
      const perturbation = multiply(normalDir, perturbationMagnitude);
      const newPoint: Vector2 = add(add(fault.originalStart, multiply(unitVec, d)), perturbation);
      perturbedVertices.push(newPoint);
    }
    // Last point is hard-coded to ensure it doesn't move due to precision errors
    perturbedVertices.push(vertices[vertices.length - 1]);

    fault.vertices = perturbedVertices;
  });
}
