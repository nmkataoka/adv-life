import { NoiseParams } from '1-game-code/Noise';
import { Random } from '1-game-code/prng';
import { generateVoronoi } from '../Voronoi/Voronoi';
import { Tectonics } from '../Tectonics';
import { perturbPlateEdges } from './perturbPlateEdges';
import { createPlatesAndFaults } from './createPlatesAndFaults';

export function generateTectonics(
  numPlates: number,
  xSize: number,
  ySize: number,
  oceanFrac: number,
  faultPerturbationNoise: NoiseParams,
  rng: Random,
): Tectonics {
  const voronoi = generateVoronoi(numPlates, xSize, ySize, 3, rng);
  const { tecPlates, faults } = createPlatesAndFaults(voronoi, oceanFrac, rng);
  perturbPlateEdges(faults, 25000, faultPerturbationNoise);
  return {
    faults,
    numPlates,
    tecPlates,
    width: xSize,
    height: ySize,
  };
}
