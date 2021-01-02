import { Vector2 } from '8-helpers/math';
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
    velocity: new Vector2(0, 0),
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
    const { x: iposx, y: iposy } = initialPos;

    // TODO: add track

    const n = surfaceNormal(elevLayer, initialPos, 1);

    // TODO: set effective params

    // Accelerate particle using classical mechanics
    // TODO: this z maybe should be a y since he used different coordinate system? unclear
    const something = new Vector2(n.x, n.z);
    drop.velocity.addMut(something.multScalar(dt / (drop.volume * drop.density)));
    drop.pos.addMut(drop.velocity.multScalar(dt));
    // Friction
    drop.velocity.multScalarMut(1 - dt * drop.friction);

    // Compute equilibrium sediment content
    let c_eq =
      drop.volume *
      drop.velocity.length() *
      (elevLayer.at(iposx, iposy) - elevLayer.at(Math.floor(drop.pos.x), Math.floor(drop.pos.y)));

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
