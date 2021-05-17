import { NameCmpt } from '0-engine';
import { createMockEntityManager } from '0-engine/ECS/test-helpers/CreateEntityManager';
import { createTown } from '1-game-code/Town/createTown';
import { createRouteCmpt, RouteCmpt } from '1-game-code/Town/RouteCmpt';
import { forEachTown } from './civGraphHelpers';

const setUpTowns = async () => {
  const eMgr = await createMockEntityManager();

  const firstTown = createTown([0, 0], 'town-0');
  const secondTown = createTown([0, 1], 'town-1', firstTown);
  const thirdTown = createTown([0, 2], 'town-2', secondTown);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fourthTown = createTown([0, -1], 'town-4', firstTown);
  const fifthTown = createTown([0, 3], 'town-5', thirdTown);

  const route = eMgr.createEntity();
  const routeCmpt = createRouteCmpt(firstTown, fifthTown);
  eMgr.addCmpt(route, routeCmpt);

  const routeMgr = eMgr.getMgr(RouteCmpt);
  const nameMgr = eMgr.getMgr(NameCmpt);

  return { firstTown, nameMgr, routeMgr };
};

describe('civGraphHelpers', () => {
  describe('forEachTown', () => {
    it('visits every town once and only once', async () => {
      const { firstTown, routeMgr, nameMgr } = await setUpTowns();
      const visitedTowns: string[] = [];
      forEachTown(firstTown, routeMgr, (townId) => {
        const name = nameMgr.get(townId);
        expect(visitedTowns.includes(name.name)).toEqual(false);
        visitedTowns.push(name.name);
      });
      expect(visitedTowns.length).toEqual(5);
    });

    it('does not visit unreachable towns', async () => {
      const { firstTown, routeMgr, nameMgr } = await setUpTowns();
      createTown([0, 10], 'town-unreachable');
      const visitedTowns: string[] = [];
      forEachTown(firstTown, routeMgr, (townId) => {
        const name = nameMgr.get(townId);
        expect(visitedTowns.includes(name.name)).toEqual(false);
        visitedTowns.push(name.name);
      });
      expect(visitedTowns.includes('town-unreachable')).toEqual(false);
      expect(visitedTowns.length).toEqual(5);
    });
  });
});
