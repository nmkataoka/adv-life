import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import CharacterCreationNavBar from './CharacterCreationNavBar';
import InfoWindow from './components/InfoWindow';
import { RootState } from '../../7-app/types';
import ScreenInfoToScreen from './components/ScreenInfoToScreen';

const screenSelector = (state: RootState) => {
  const { screenIdx } = state.characterCreation;
  const { characterAttributeGroups: { [screenIdx]: screenInfo } } = state.characterCreation;
  return screenInfo;
};

export default function CharacterCreationScene(): JSX.Element {
  const screenInfo = useSelector(screenSelector);

  return (
    <Container>
      <CharacterCreationNavBar />
      Character Creation
      <Content>
        <ScreenInfoToScreen screenInfo={screenInfo} />
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
