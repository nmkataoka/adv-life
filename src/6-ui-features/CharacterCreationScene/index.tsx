import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import CharacterCreationNavBar from './CharacterCreationNavBar';
import InfoWindow from './components/InfoWindow';
import { RootState } from '../../7-app/types';
import ScreenInfoToScreen from './components/ScreenInfoToScreen';
import CharacterSummaryColumn from './CharacterSummaryColumn';
import { changedTitle } from '../TopBar/topBarSlice';

const screenSelector = (state: RootState) => {
  const { screenIdx } = state.characterCreation;
  const { characterAttributeGroups: { [screenIdx]: screenInfo } } = state.characterCreation;
  return screenInfo;
};

export default function CharacterCreationScene(): JSX.Element {
  const dispatch = useDispatch();
  const screenInfo = useSelector(screenSelector);

  useEffect(() => {
    dispatch(changedTitle('Character Creation'));
  }, [dispatch]);

  return (
    <Container>
      <CharacterCreationNavBar />
      <Content>
        <ScreenInfoToScreen screenInfo={screenInfo} />
        <CharacterSummaryColumn />
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
  align-items: stretch;
  padding-top: 1.5em;
`;
