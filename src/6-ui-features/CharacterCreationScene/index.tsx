import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import CharacterCreationNavBar from './CharacterCreationNavBar';
import InfoWindow from './components/InfoWindow';
import { RootState } from '../../7-app/types';
import RaceSelection from './screens/RaceSelection';
import ClassSelection from './screens/ClassSelection';
import AttributeDistribution from './screens/AttributeDistribution';

const screens: {[key: string]: () => JSX.Element} = {
  Attributes: AttributeDistribution,
  Class: ClassSelection,
  Race: RaceSelection,
};

export default function CharacterCreationScene(): JSX.Element {
  const screen = useSelector((state: RootState) => state.characterCreation.screen);

  const Screen = screens[screen];

  return (
    <Container>
      <CharacterCreationNavBar />
      Character Creation
      <Content>
        <Screen />
        <InfoWindow />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-around;
`;
