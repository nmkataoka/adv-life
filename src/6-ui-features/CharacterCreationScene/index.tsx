import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useReduxSelector, useReduxDispatch } from '11-redux-wrapper';
import { RootState } from '7-app/types';
import TopBar from '6-ui-features/TopBar';
import CharacterCreationNavBar from './CharacterCreationNavBar';
import InfoWindow from './components/InfoWindow';
import ScreenInfoToScreen from './components/ScreenInfoToScreen';
import CharacterSummaryColumn from './CharacterSummaryColumn';
import { changedTitle } from '../TopBar/topBarSlice';

const screenSelector = (state: RootState) => {
  const { screenIdx } = state.characterCreation;
  const {
    characterAttributeGroups: { [screenIdx]: screenInfo },
  } = state.characterCreation;
  return screenInfo;
};

export default function CharacterCreationScene(): JSX.Element {
  const dispatch = useReduxDispatch();
  const screenInfo = useReduxSelector(screenSelector);

  useEffect(() => {
    dispatch(changedTitle('Character Creation'));
  }, [dispatch]);

  return (
    <>
      <TopBar />
      <Container>
        <CharacterCreationNavBar />
        <Content>
          <ScreenInfoToScreen screenInfo={screenInfo} />
          <CharacterSummaryColumn />
          <InfoWindow />
        </Content>
      </Container>
    </>
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
