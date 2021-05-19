import { Entity, EntityManager } from '0-engine';
import { Random } from '1-game-code/prng';
import { createTown } from '1-game-code/Town/createTown';
import { DataLayer } from '../DataLayer/DataLayer';
import { CivCmpt } from './CivCmpt';

export function createCiv(
  eMgr: EntityManager,
  elevLayer: DataLayer,
  rng: Random,
  civName: string,
): Entity {
  const civEntity = eMgr.createEntity(civName);
  const firstTownCoords = placeCivFirstTown(elevLayer, rng);
  createTown(eMgr, civEntity, firstTownCoords);
  const civCmpt = new CivCmpt();
  eMgr.addCmpt(civEntity, civCmpt);
  return civEntity;
}

function placeCivFirstTown(elevLayer: DataLayer, rng: Random): [number, number] {
  let attempts = 0;

  const { height, width } = elevLayer;

  function getRandomPoint() {
    const x = Math.floor(rng.random() * width);
    const y = Math.floor(rng.random() * height);
    return [x, y] as const;
  }

  while (attempts < 1000) {
    ++attempts;
    const [x, y] = getRandomPoint();
    const elev = elevLayer.at(x, y);
    if (elev > 0) {
      // No underwater towns!
      return [x, y];
    }
  }

  throw new Error(
    'Encountered possible infinite loop when generating towns. If your world is > 95% water, you may need to increase the land fraction.',
  );
}
