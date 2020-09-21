import characterCreationReducer from '../6-ui-features/CharacterCreationScene/characterCreationSlice';
import combatLogReducer from '../6-ui-features/CombatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';
import itemClassesReducer from '../6-ui-features/Items/itemClassesSlice';
import materialsReducer from '../6-ui-features/Items/materialsSlice';
import modalMetaReducer from '5-react-components/Modal/modalMetaSlice';
import playerReducer from '../6-ui-features/Player/playerSlice';
import sceneMetaReducer from '../6-ui-features/sceneManager/sceneMetaSlice';
import topBarReducer from '../6-ui-features/TopBar/topBarSlice';
import townLocationsReducer from '../6-ui-features/TownLocation/townLocationsSlice';
import townsReducer from '../6-ui-features/Towns/townSlice';
import townSceneReducer from '../6-ui-features/TownScene/townSceneSlice';

const rootReducer = {
  characterCreation: characterCreationReducer,
  combatLog: combatLogReducer,
  combatScene: combatSceneReducer,
  itemClasses: itemClassesReducer,
  materials: materialsReducer,
  modalMeta: modalMetaReducer,
  player: playerReducer,
  sceneMeta: sceneMetaReducer,
  topBar: topBarReducer,
  townLocations: townLocationsReducer,
  towns: townsReducer,
  townScene: townSceneReducer,
};

export default rootReducer;
