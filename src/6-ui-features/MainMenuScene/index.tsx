import React from 'react';
import styled from '@emotion/styled';
import { changedScene, Scene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { createPlayerCharacter } from '6-ui-features/CharacterCreationScene/characterCreationSlice';
import { Image } from '5-react-components/Image';
import { getColor } from '6-ui-features/Theme';

export default function MainMenuScene(): JSX.Element {
  const reduxDispatch = useReduxDispatch();

  const handleSceneSelection = (scene: Scene) => () => {
    if (scene === Scene.Colosseum) {
      reduxDispatch(createPlayerCharacter());
    }
    reduxDispatch(changedScene(scene));
  };

  return (
    <Col>
      <MainMenuBackgroundImage alt="main-menu-background" src="/main-menu-background.png" />
      <Title>Adventurer&apos;s Life</Title>
      <InnerCol>
        <Button onClick={handleSceneSelection(Scene.CharacterCreation)}>New Game</Button>
        <Button onClick={handleSceneSelection(Scene.Colosseum)}>Colosseum</Button>
        <Button onClick={handleSceneSelection(Scene.WorldGen)}>Create World</Button>
      </InnerCol>
    </Col>
  );
}

const Col = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
`;

const InnerCol = styled.div`
  background-color: ${getColor('grayDarker')};
  box-shadow: var(--shadow-6);
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-width: 20em;
`;

const Title = styled.h1`
  text-shadow: var(--text-shadow-basic);
  color: ${getColor('blueSky')};
  font-size: 6rem;
`;

const Button = styled.button`
  font-size: 1.6em;
  padding: 0.5em;
  margin: 0.2em;
  color: ${getColor('black')};
  background-color: ${getColor('blueSky')};
`;

const MainMenuBackgroundImage = styled(Image)`
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  z-index: -1;
`;
