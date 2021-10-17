import { Vector2 } from '8-helpers/math';
import { DataLayer } from '../DataLayer/DataLayer';
import { surfaceNormal } from './surfaceNormal';

export type Drop = {
  pos: Vector2;

  velocity: Vector2;

  /** The total drop volume equals the height times the area of one map tile */
  height: number;

  /** The fraction of volume that is sediment */
  sediment: number;

  /** Gives varying amounts of inertia */
  density: number;

  evapRate: number;

  depositionRate: number;

  minHeight: number;

  friction: number;

  // waterDepositionRate: number;
};

export function createDrop(data: Omit<Partial<Drop>, 'velocity'> & Pick<Drop, 'pos'>): Drop {
  return {
    velocity: new Vector2(0, 0),
    height: 1.0,
    sediment: 0.0,
    density: 1.0,
    evapRate: 0.001,
    depositionRate: 0.08,
    minHeight: 0.01,
    friction: 0.1,
    // waterDepositionRate: 100.0,
    ...data,
  };
}

/** Gravitational constant in m/s2 */
const g = 9.81;

/** Number of iterations that triggers the infinite loop error */
const maxCount = 1000;

/** Systems that don't need to approach a steady-state relationship
 * use an inflated timestep dt.
 */
const speedFactor = 400;

/* eslint-disable camelcase */
/**
 *
 * @param drop
 * @param elevLayer
 * @param dt Due to nonlinear physics relationships, dt must remain small. To compensate,
 * certain processes that don't approach a steady state are extrapolated with speedFactor to speed things up.
 */
export function descend(drop: Drop, elevLayer: DataLayer, dt: number): void {
  const { metersPerCoord } = elevLayer;

  let count = 0;
  while (drop.height > drop.minHeight && count < maxCount) {
    const initialPos = drop.pos.toVec2i();
    const { x: iposx, y: iposy } = initialPos;

    if (iposy <= 1 || iposy >= elevLayer.height - 1) {
      // console.log('drop reached edge of map');
      break;
    }

    // If a drop reaches the ocean, it disappears
    const elev = elevLayer.at(iposx, iposy);
    if (elev < 0) {
      // console.log('drop reached ocean');
      break;
    }

    // TODO: add track
    const n = surfaceNormal(elevLayer, initialPos, 1);

    // TODO: set effective params

    // Accelerate particle using classical mechanics
    // TODO: this z maybe should be a y since he used different coordinate system? unclear

    // Taking the downwards force due to gravitational acceleration and subtracting the
    // normal force exerted by the surface, you are left with horizontal acceleration
    // which is the equivalent of the xy component of the surface normal.
    const horizontalAcceleration = new Vector2(n.x, n.y).multScalar(g);

    // I don't understand why Nick has acceleration due to gravity being mass dependent
    // const something = new Vector2(n.x, n.y);
    // drop.velocity.addMut(something.multScalar(dt / mass));

    // a = dv/dt
    // Acceleration is one of the nonlinear relationships (due to friction) that
    // necessitates a small dt so we can approach steady state.
    drop.velocity.addMut(horizontalAcceleration.multScalar(dt));

    if (Number.isNaN(drop.velocity.x)) {
      throw new Error(
        `Encountered NaN value, n: ${n.toString()} horizontalAccel: ${horizontalAcceleration.toString()}`,
      );
    }

    // Laminar flow friction - friction is proportional to velocity

    // Note: I moved friction before position change due to enormous timescales
    // that otherwise result in huge acceleration + positional changes each dt

    // Nick uses this friction. It's proportional to velocity but my derivation shows
    // something slightly different.
    // drop.velocity.multScalarMut(1 - dt * drop.friction);

    // Formula derived from Darcy–Weisbach equation in pressure loss per pipe length
    // and converting to velocity loss per time via Bernoulli's equation to relate
    // velocity and pressure. No idea if this derivation is even close to correct.

    // I'm getting:
    //   dv/dt = fD * v1 ^2 / D
    //   where D is the diameter of the pipe.
    // Which is:
    //   v2 = (1 - fD * v1 * dt / D) * v1
    // Rolling the pipe diameter into the constant, we get:
    //  v2 = (1 - C * v1 * dt) * v1
    // Units do work out better like this, so here goes
    const speed = drop.velocity.length();
    const fric = Math.max(0, 1 - dt * drop.friction * speed);
    drop.velocity.multScalarMut(fric);

    // v = dx/dt, but need to account for conversion between real units and map pixels

    // Position changes are one of the artifically extrapolated aspects. Since velocity and
    // position are linearly correlated, we can skip ahead using a giant timestep
    drop.pos.addMut(drop.velocity.multScalar((speedFactor * dt) / metersPerCoord));

    // Compute equilibrium sediment content
    // Since max velocity is around 10, this sets the max sediment to 0.5
    let c_eq = drop.velocity.length() / 20;

    if (c_eq < 0) c_eq = 0;

    // Compute capacity difference ("driving force")
    const c_diff = c_eq - drop.sediment;

    // Perform the mass transfer! Another system that needs to approach steady state with a small dt.
    drop.sediment += dt * drop.depositionRate * c_diff;
    const elevChange = dt * drop.height * drop.depositionRate * c_diff;
    const newElev = elevLayer.at(iposx, iposy) - elevChange;
    if (newElev > 3.40282347e38 || newElev < -3.40282347e38) {
      throw new Error('Erosion/deposition caused elevation out of float32 bounds.');
    }
    elevLayer.set(iposx, iposy, newElev);

    // Evaporate
    // Real evaporation is annoying to deal with so we just evaporate a set fraction per timestep
    const volChangeFrac = 1 - drop.evapRate;
    drop.height *= volChangeFrac;

    // Total sediment remains constant, so sediment fraction needs to increase if water volume decreases
    drop.sediment /= volChangeFrac;

    // Infinite loop check
    ++count;
  }

  // There are three reasons a drop stops descending. Handle the cases
  if (count >= maxCount) {
    throw new Error('drop.descend got stuck in an infinite loop');
  } else if (drop.height <= drop.minHeight) {
    // Drop evaporated, deposit remaining sediment
    const elevChange = drop.height * drop.sediment;
    const { x, y } = drop.pos.toVec2i();
    const newElev = elevLayer.at(x, y) + elevChange;
    elevLayer.set(x, y, newElev);
  }
}

export function flood(): void {}

/* eslint-enable camelcase */
