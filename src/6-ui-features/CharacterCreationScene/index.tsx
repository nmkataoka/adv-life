import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useReduxSelector, useReduxDispatch } from '11-redux-wrapper';
import { RootState } from '7-app/types';
import TopBar from '6-ui-features/TopBar';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import { changedScene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { getCivs } from '3-frontend-api';
import { InfoContextProvider, InfoRoot } from '6-ui-features/Info';
import CharacterCreationNavBar from './CharacterCreationNavBar';
import ScreenInfoToScreen from './components/ScreenInfoToScreen';
import CharacterSummaryColumn from './CharacterSummaryColumn';
import { changedTitle } from '../TopBar/topBarSlice';
import { updateCharacterAttributeGroup } from './characterCreationSlice';
import Window from './components/Window';

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
  const civs = useSelector2(getCivs);

  // Dynamic data dependent on engine state can be updated here.
  // This is not very elegant.
  useEffect(() => {
    if (civs && civs.length > 0) {
      reduxDispatch(
        updateCharacterAttributeGroup({
          name: 'Civilization',
          selectType: 'oneOf',
          options: civs.map((civ) => ({
            label: civ.name,
            info: 'A civilization',
            value: `${civ.id}`,
          })),
          selectedIdx: 0,
        }),
      );
    }
  }, [civs, reduxDispatch]);

  useEffect(() => {
    reduxDispatch(changedTitle('Character Creation'));
  }, [reduxDispatch]);

  return (
    <InfoContextProvider>
      <TopBar />
      <Container>
        {elevations ? (
          <>
            <CharacterCreationNavBar />
            <Content>
              <ScreenInfoToScreen screenInfo={screenInfo} />
              <CharacterSummaryColumn />
              <InfoRoot
                defaultContent={
                  <Window header="Information">Click on an option to learn more.</Window>
                }
              />
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
    </InfoContextProvider>
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
