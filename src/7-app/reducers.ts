import combatLogReducer from '../6-ui-features/CombatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';
import modalMetaReducer from '../5-react-components/Modal/modalMetaSlice';
import sceneMetaReducer from '../6-ui-features/sceneManager/sceneMetaSlice';

const rootReducer = {
  combatLog: combatLogReducer,
  combatScene: combatSceneReducer,
  modalMeta: modalMetaReducer,
  sceneMeta: sceneMetaReducer,
};

export default rootReducer;
