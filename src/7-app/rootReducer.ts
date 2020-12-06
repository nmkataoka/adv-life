import characterCreationReducer from '6-ui-features/CharacterCreationScene/characterCreationSlice';
import combatSceneReducer from '6-ui-features/CombatScene/combatSceneSlice';
import modalMetaReducer from '5-react-components/Modal/modalMetaSlice';
import playerReducer from '6-ui-features/Player/playerSlice';
import sceneMetaReducer from '6-ui-features/sceneManager/sceneMetaSlice';
import topBarReducer from '6-ui-features/TopBar/topBarSlice';
import townLocationsReducer from '6-ui-features/TownLocation/townLocationsSlice';
import townSceneReducer from '6-ui-features/TownScene/townSceneSlice';
import worldMapReducer from '6-ui-features/WorldMap/worldMapSlice';

const rootReducer = {
  characterCreation: characterCreationReducer,
  combatScene: combatSceneReducer,
  modalMeta: modalMetaReducer,
  player: playerReducer,
  sceneMeta: sceneMetaReducer,
  topBar: topBarReducer,
  townLocations: townLocationsReducer,
  townScene: townSceneReducer,
  worldMap: worldMapReducer,
};

export default rootReducer;
