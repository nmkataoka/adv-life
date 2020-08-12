import sinon from 'sinon';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { updateUnitsFromEngine } from './actions';
import * as UnitInfoApi from '../../3-api/UnitInfo';
import { givenUnitInfo } from '../../3-api/givenUnitInfo';
import rootReducer from '../../7-app/rootReducer';

describe('combatSceneSlice', () => {
  let store: EnhancedStore;
  const getUnitInfos = sinon.stub(UnitInfoApi, 'getUnitInfos');
  beforeEach(() => {
    store = configureStore({ reducer: rootReducer });
  });

  describe('updateUnitsFromEngine', () => {
    it('sets isInCombat to true when in combat', () => {
      getUnitInfos.callsFake(() => ({
        0: givenUnitInfo({ isEnemy: false }),
        1: givenUnitInfo({ isEnemy: true, targetEntity: -1 }),
      }));

      store.dispatch<any>(updateUnitsFromEngine());

      expect(store.getState().combatScene.isInCombat).toBe(true);
    });

    it('sets isInCombat to true when in combat', () => {
      getUnitInfos.callsFake(() => ({
        0: givenUnitInfo({ isEnemy: false }),
        1: givenUnitInfo({ isEnemy: false, targetEntity: -1 }),
      }));

      store.dispatch<any>(updateUnitsFromEngine());

      expect(store.getState().combatScene.isInCombat).toBe(false);
    });
  });
});
