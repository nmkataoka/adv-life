import { generateVoronoi } from '../Voronoi/Voronoi';
import { Tectonics } from '../Tectonics';
import { perturbPlateEdges } from './perturbPlateEdges';
import { createPlatesAndFaults } from './createPlatesAndFaults';

export function generateTectonics(numPlates: number, xSize: number, ySize: number): Tectonics {
  const voronoi = generateVoronoi(numPlates, xSize, ySize, 3);
  const { tecPlates, faults } = createPlatesAndFaults(voronoi);
  perturbPlateEdges(faults, 25000);
  return {
    faults,
    numPlates,
    tecPlates,
    width: xSize,
    height: ySize,
  };
}
