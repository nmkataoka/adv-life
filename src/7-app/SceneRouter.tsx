import styled from '@emotion/styled';
import { useReduxSelector } from '11-redux-wrapper';

import { Scene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { RootState } from '7-app/types';

import CharacterCreationScene from '6-ui-features/CharacterCreationScene';
import ColosseumScene from '6-ui-features/ColosseumScene';
import MainMenuScene from '6-ui-features/MainMenuScene';
import TownScene from '6-ui-features/TownScene';
import WorldGenScene from '6-ui-features/WorldGenScene';

const scenes: Record<Scene, () => JSX.Element> = {
  characterCreation: CharacterCreationScene,
  colosseum: ColosseumScene,
  mainMenu: MainMenuScene,
  town: TownScene,
  worldGen: WorldGenScene,
};

export function SceneRouter(): JSX.Element {
  const currentScene = useReduxSelector((state: RootState) => state.sceneMeta.currentScene);
  const SceneComponent = scenes[currentScene];
  return (
    <Container>
      <SceneComponent />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-width: 1200px;
  width: 100vw;
  height: 90vh;
  box-sizing: border-box;
  overflow: hidden;
`;
