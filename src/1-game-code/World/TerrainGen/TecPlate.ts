import { Vector2 } from '8-helpers/math';
import { Fault } from './Fault';

export type TecPlate = {
  /** Indicative of the plate's relative age from 0-1, used to determine plate's base elevation.
   *  Scale is completely arbitrary. */
  age: number;
  center: Vector2;
  faults: Fault[];
  isOceanic: boolean;
  velocity: Vector2;
};

/** The tectonic plate's elevation before fault activity and noise
 * is directly calculable from isOceanic and it's age
 */
export function getBaseElevation(tecPlate: TecPlate): number {
  const { age, isOceanic } = tecPlate;
  if (isOceanic) {
    return -(age * 1500 + 3000);
  }
  return age * -500 + 1000;
}
