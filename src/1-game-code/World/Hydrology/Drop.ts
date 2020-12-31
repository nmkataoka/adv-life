import { Vector2 } from '8-helpers/math';
import { add, multiply, norm } from '8-helpers/math/Vector2';
import { DataLayer } from '../DataLayer/DataLayer';
import { surfaceNormal } from './surfaceNormal';

export type Drop = {
  pos: Vector2;
  velocity: Vector2;

  /** The total drop volume */
  volume: number;

  /** The fraction of volume that is sediment */
  sediment: number;

  dt: number;

  /** Gives varying amounts of inertia */
  density: number;

  evapRate: number;

  depositionRate: number;

  minVol: number;

  friction: number;

  waterDepositionRate: number;
};

export function createDrop(pos: Vector2): Drop {
  return {
    pos,
    velocity: [0, 0],
    volume: 1.0,
    sediment: 0.0,
    dt: 1.2,
    density: 1.0,
    evapRate: 0.001,
    depositionRate: 0.08,
    minVol: 0.01,
    friction: 0.1,
    waterDepositionRate: 100.0,
  };
}

/* eslint-disable camelcase */
export function descend(drop: Drop, elevLayer: DataLayer, dt: number): void {
  let count = 0;
  while (drop.volume > drop.minVol || count > 10000) {
    // console.log('drop debug', drop);
    const initialPos = drop.pos;
    const [iposx, iposy] = initialPos;

    // TODO: add track

    const n = surfaceNormal(elevLayer, initialPos, 1);

    // TODO: set effective params

    // Accelerate particle using classical mechanics
    drop.velocity = add(drop.velocity, multiply([n[0], n[2]], dt / (drop.volume * drop.density)));
    drop.pos = add(drop.pos, multiply(drop.velocity, dt));
    // Friction
    drop.velocity = multiply(drop.velocity, 1 - dt * drop.friction);

    // Compute equilibrium sediment content
    let c_eq =
      drop.volume *
      norm(drop.velocity) *
      (elevLayer.at(iposx, iposy) - elevLayer.at(Math.floor(drop.pos[0]), Math.floor(drop.pos[1])));

    if (c_eq < 0) c_eq = 0;

    // Compute capacity difference ("driving force")
    const c_diff = c_eq - drop.sediment;

    // Perform the mass transfer!
    drop.sediment += dt * drop.depositionRate * c_diff;
    elevLayer.set(
      iposx,
      iposy,
      elevLayer.at(iposx, iposy) - dt * drop.volume * drop.depositionRate * c_diff,
    );

    // Evaporate
    drop.volume *= 1 - dt * drop.evapRate;

    // Infinite loop check
    ++count;
  }
  if (count >= 10000) {
    throw new Error('drop.descend got stuck in an infinite loop');
  }
}

export function flood(): void {}
