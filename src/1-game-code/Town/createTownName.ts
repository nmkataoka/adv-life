import { Random } from '1-game-code/prng';

const colors = [
  'white',
  'black',
  'bronze',
  'red',
  'blue',
  'brown',
  'green',
  'cream',
  'yellow',
  'orange',
  'aqua',
  'gray',
];

const adjectives = [...colors];

const naturalPhenomena = [
  'cloud',
  'east',
  'light',
  'moon',
  'north',
  'shadow',
  'south',
  'sun',
  'west',
];

const naturalLocations = [
  'barrow',
  'brook',
  'crag',
  'creek',
  'dale',
  'dell',
  'falls',
  'fell',
  'field',
  'grove',
  'harbor',
  'hill',
  'hold',
  'mere',
  'meadow',
  'mount',
  'pass',
  'peak',
  'plain',
  'pond',
  'rock',
  'run',
  'scar',
  'vale',
  'wall',
];

const firstNames = [...adjectives, ...naturalPhenomena];

const lastNames = [...naturalLocations];

export function createTownName(rng: Random): string {
  let firstName: string;
  let lastName: string;
  let count = 0;
  do {
    firstName = firstNames[Math.floor(rng.random() * firstNames.length)];
    lastName = lastNames[Math.floor(rng.random() * lastNames.length)];
    ++count;
    if (count > 100) {
      throw new Error(
        'Stuck in infinite loop generating town name. Something may be wrong with the rng supplied.',
      );
    }
  } while (firstName === lastName);
  return firstName + lastName;
}
