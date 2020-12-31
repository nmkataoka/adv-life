import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { Scene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { RootState } from '7-app/types';

import CharacterCreationScene from '6-ui-features/CharacterCreationScene';
import ColosseumScene from '6-ui-features/ColosseumScene';
import MainMenuScene from '6-ui-features/MainMenuScene';
import TownScene from '6-ui-features/TownScene';
import WorldGenScene from '6-ui-features/WorldGenScene';

const scenes = {
  [Scene.CharacterCreation]: CharacterCreationScene,
  [Scene.Colosseum]: ColosseumScene,
  [Scene.MainMenu]: MainMenuScene,
  [Scene.Town]: TownScene,
  [Scene.WorldGen]: WorldGenScene,
};

export function SceneRouter(): JSX.Element {
  const currentScene = useSelector((state: RootState) => state.sceneMeta.currentScene);
  const SceneComponent = scenes[currentScene];
  return (
    <Container>
      <SceneComponent />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 80vw;
`;
