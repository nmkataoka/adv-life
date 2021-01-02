import { Vector2 } from '8-helpers/math';
import { createFaultFromEdge } from './Fault';
import { TecPlate } from './TecPlate';
import { createEdge, VorEdge } from './Voronoi/VorEdge';

describe('Fault', () => {
  it('fault normalDir points toward the higher tec plate', () => {
    const edge: VorEdge = createEdge(new Vector2(1, 0), new Vector2(1, 2));
    const tecPlateHigher: TecPlate = {
      age: 0,
      center: new Vector2(0, 1),
      faults: [],
      isOceanic: false,
      velocity: new Vector2(1, 1),
    };
    const tecPlateLower: TecPlate = {
      age: 0,
      center: new Vector2(2, 1),
      faults: [],
      isOceanic: true,
      velocity: new Vector2(-1, 1),
    };
    let fault = createFaultFromEdge(edge, tecPlateLower, tecPlateHigher, 400, true);
    let pointInNormalDir = new Vector2(1, 1).add(fault.normalDir);
    expect(pointInNormalDir.dist(tecPlateHigher.center)).toBeLessThan(
      pointInNormalDir.dist(tecPlateLower.center),
    );

    const edge2: VorEdge = createEdge(new Vector2(1, 2), new Vector2(1, 0));
    fault = createFaultFromEdge(edge2, tecPlateLower, tecPlateHigher, 400, true);
    pointInNormalDir = new Vector2(1, 1).add(fault.normalDir);
    expect(pointInNormalDir.dist(tecPlateHigher.center)).toBeLessThan(
      pointInNormalDir.dist(tecPlateLower.center),
    );
  });
});
