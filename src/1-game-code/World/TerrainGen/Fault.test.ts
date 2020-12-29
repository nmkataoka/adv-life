import { add, dist } from '8-helpers/math/Vector2';
import { createFaultFromEdge } from './Fault';
import { TecPlate } from './TecPlate';
import { createEdge, VorEdge } from './VorEdge';

describe('Fault', () => {
  it('fault normalDir points toward the higher tec plate', () => {
    const edge: VorEdge = createEdge([1, 0], [1, 2]);
    const tecPlateHigher: TecPlate = {
      age: 0,
      center: [0, 1],
      faults: [],
      isOceanic: false,
      velocity: [1, 1],
    };
    const tecPlateLower: TecPlate = {
      age: 0,
      center: [2, 1],
      faults: [],
      isOceanic: true,
      velocity: [-1, 1],
    };
    let fault = createFaultFromEdge(edge, tecPlateLower, tecPlateHigher, 400, true);
    let pointInNormalDir = add([1, 1], fault.normalDir);
    expect(dist(pointInNormalDir, tecPlateHigher.center)).toBeLessThan(
      dist(pointInNormalDir, tecPlateLower.center),
    );

    const edge2: VorEdge = createEdge([1, 2], [1, 0]);
    fault = createFaultFromEdge(edge2, tecPlateLower, tecPlateHigher, 400, true);
    pointInNormalDir = add([1, 1], fault.normalDir);
    expect(dist(pointInNormalDir, tecPlateHigher.center)).toBeLessThan(
      dist(pointInNormalDir, tecPlateLower.center),
    );
  });
});
