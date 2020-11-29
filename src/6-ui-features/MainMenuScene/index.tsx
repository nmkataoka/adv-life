import React from 'react';
import styled from '@emotion/styled';
import { changedScene, Scene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { useDispatch } from 'react-redux';
import { createPlayerCharacter } from '6-ui-features/CharacterCreationScene/characterCreationSlice';

export default function MainMenuScene(): JSX.Element {
  const dispatch = useDispatch();
  const handleSceneSelection = (scene: Scene) => () => {
    if (scene === Scene.Colosseum) {
      dispatch(createPlayerCharacter());
    }
    dispatch(changedScene(scene));
  };

  return (
    <Col>
      <Title>Adventurer&apos;s Life</Title>
      <Button onClick={handleSceneSelection(Scene.CharacterCreation)}>New Game</Button>
      <Button onClick={handleSceneSelection(Scene.Colosseum)}>Colosseum</Button>
      <Button onClick={handleSceneSelection(Scene.WorldGen)}>Create World</Button>
    </Col>
  );
}

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 2em;
`;

const Title = styled.h1``;

const Button = styled.button`
  font-size: 1.6em;
  padding: 0.5em;
  margin: 1em 0;
`;
