import { NoiseParams } from '1-game-code/Noise';
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
): Tectonics {
  const voronoi = generateVoronoi(numPlates, xSize, ySize, 3);
  const { tecPlates, faults } = createPlatesAndFaults(voronoi, oceanFrac);
  perturbPlateEdges(faults, 25000, faultPerturbationNoise);
  return {
    faults,
    numPlates,
    tecPlates,
    width: xSize,
    height: ySize,
  };
}
