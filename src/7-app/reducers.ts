import characterCreationReducer from '../6-ui-features/CharacterCreationScene/characterCreationSlice';
import combatLogReducer from '../6-ui-features/CombatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';
import modalMetaReducer from '../5-react-components/Modal/modalMetaSlice';
import playerReducer from '../6-ui-features/Player/playerSlice';
import sceneMetaReducer from '../6-ui-features/sceneManager/sceneMetaSlice';

const rootReducer = {
  characterCreation: characterCreationReducer,
  combatLog: combatLogReducer,
  combatScene: combatSceneReducer,
  modalMeta: modalMetaReducer,
  player: playerReducer,
  sceneMeta: sceneMetaReducer,
};

export default rootReducer;
