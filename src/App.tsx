import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import { useSelector } from 'react-redux';
import TopBar from './6-ui-features/TopBar';
import { GameManager } from './0-engine/GameManager';
import { Scenes } from './6-ui-features/sceneManager/sceneMetaSlice';

import CombatScene from './6-ui-features/CombatScene';
import TownScene from './6-ui-features/TownScene';
import { RootState } from './7-app/types';

const scenes = {
  [Scenes.Combat]: CombatScene,
  [Scenes.Town]: TownScene,
};

function App(): JSX.Element {
  useEffect(() => {
    GameManager.instance.Start();

    // Only start once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentScene = useSelector((state: RootState) => state.sceneMeta.currentScene);
  const Scene = scenes[currentScene];

  return (
    <Container>
      <TopBar />
      <Scene />
    </Container>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  width: 80vw;
`;
