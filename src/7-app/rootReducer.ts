import characterCreationReducer from '../6-ui-features/CharacterCreationScene/characterCreationSlice';
import combatLogReducer from '../6-ui-features/CombatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';
import modalMetaReducer from '../5-react-components/Modal/modalMetaSlice';
import playerReducer from '../6-ui-features/Player/playerSlice';
import sceneMetaReducer from '../6-ui-features/sceneManager/sceneMetaSlice';
import topBarReducer from '../6-ui-features/TopBar/topBarSlice';
import townLocationReducer from '../6-ui-features/TownLocation/townLocationSlice';
import townReducer from '../6-ui-features/Town/townSlice';
import townSceneReducer from '../6-ui-features/TownScene/townSceneSlice';

const rootReducer = {
  characterCreation: characterCreationReducer,
  combatLog: combatLogReducer,
  combatScene: combatSceneReducer,
  modalMeta: modalMetaReducer,
  player: playerReducer,
  sceneMeta: sceneMetaReducer,
  topBar: topBarReducer,
  townLocation: townLocationReducer,
  town: townReducer,
  townScene: townSceneReducer,
};

export default rootReducer;
