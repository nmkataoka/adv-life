import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import { useSelector } from 'react-redux';
import { GameManager } from '0-engine/GameManager';
import { Provider as EcsalProvider } from '4-react-ecsal';

import MainMenuScene from '6-ui-features/MainMenuScene';
import ColosseumScene from '6-ui-features/ColosseumScene';
import WorldGenScene from '6-ui-features/WorldGenScene';
import TopBar from './6-ui-features/TopBar';
import { Scene } from './6-ui-features/sceneManager/sceneMetaSlice';

import TownScene from './6-ui-features/TownScene';
import { RootState } from './7-app/types';
import CharacterCreationScene from './6-ui-features/CharacterCreationScene';

const scenes = {
  [Scene.CharacterCreation]: CharacterCreationScene,
  [Scene.Colosseum]: ColosseumScene,
  [Scene.MainMenu]: MainMenuScene,
  [Scene.Town]: TownScene,
  [Scene.WorldGen]: WorldGenScene,
};

function App(): JSX.Element {
  useEffect(() => {
    void GameManager.instance.Start();

    // Only start once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentScene = useSelector((state: RootState) => state.sceneMeta.currentScene);
  const SceneComponent = scenes[currentScene];

  return (
    <EcsalProvider store={GameManager.instance.eMgr}>
      <Container>
        <TopBar />
        <SceneComponent />
      </Container>
    </EcsalProvider>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  width: 80vw;
`;
