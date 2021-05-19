import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useReduxSelector, useReduxDispatch } from '11-redux-wrapper';
import { RootState } from '7-app/types';
import TopBar from '6-ui-features/TopBar';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import { changedScene } from '6-ui-features/sceneManager/sceneMetaSlice';
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
  const reduxDispatch = useReduxDispatch();
  const screenInfo = useReduxSelector(screenSelector);
  const elevations = useSelector2(getWorldMapLayer('elevation'));

  useEffect(() => {
    reduxDispatch(changedTitle('Character Creation'));
  }, [reduxDispatch]);

  return (
    <>
      <TopBar />
      <Container>
        {elevations ? (
          <>
            <CharacterCreationNavBar />
            <Content>
              <ScreenInfoToScreen screenInfo={screenInfo} />
              <CharacterSummaryColumn />
              <InfoWindow />
            </Content>
          </>
        ) : (
          <>
            You must create a world before creating a character.
            <button onClick={() => reduxDispatch(changedScene('worldGen'))} type="button">
              Create World
            </button>
          </>
        )}
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
