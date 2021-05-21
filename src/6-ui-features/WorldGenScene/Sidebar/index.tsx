import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';
import produce from 'immer';
import { useDispatch } from '4-react-ecsal';
import { GameManager } from '0-engine/GameManager';
import { useReduxDispatch, useReduxSelector } from '11-redux-wrapper';
import { changedScene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { consoleWarn } from '8-helpers/console';
import { createCiv } from '1-game-code/World/Civs/CivSys';
import { Tabs } from './Tabs';
import { WorldGenModules } from '../constants';
import { TabContent } from './TabContent';
import { createWorld } from './createWorld';
import { getActiveModule } from '../worldGenSceneSlice';
import { doRain } from './doRain';

type SidebarProps = {
  seed: string;
};

export function Sidebar({ seed }: SidebarProps): JSX.Element {
  const reduxDispatch = useReduxDispatch();
  const dispatch = useDispatch();
  const activeModule = useReduxSelector(getActiveModule);
  const [contentState, setContentState] = useState(WorldGenModules);

  const content = contentState.find(({ key }) => key === activeModule)?.content;
  if (!content) throw new Error('Impossible. This is to make TypeScript happy.');

  const onChange =
    (heading: string) =>
    (name: string) =>
    (num: number): void => {
      const nextState = produce(contentState, (draft) => {
        const option = draft
          .find(({ key }) => activeModule === key)
          ?.content.find(({ heading: h }) => h === heading)
          ?.options.find(({ name: n }) => n === name);
        if (option) {
          option.value = num;
        }
      });
      setContentState(nextState);
    };

  const generateWorld = async () => {
    // TODO this switch case is clearly a problem, this whole sidebar probably needs a rethink
    // Although keep it tightly coupled to redux. I tried decoupling the character creation scene from
    // redux and using more composition and it failed due to the need to have all the data in one
    // place for saving. So let's keep the redux state management.
    if (activeModule === 'terrain') {
      await GameManager.instance.restart();
      await dispatch(createWorld(seed, contentState));
    } else if (activeModule === 'water') {
      await dispatch(doRain(contentState));
    } else if (activeModule === 'civilizations') {
      await dispatch(
        createCiv({
          civName: 'Romylon',
        }),
      );
    } else if (activeModule === 'finish') {
      // Return to the main menu with the world now created.
      // User is expected to start a new game.
      reduxDispatch(changedScene('mainMenu'));
    } else {
      consoleWarn(`Go button is not implemented for world gen module ${activeModule}`);
    }
  };

  return (
    <Container>
      <Tabs />
      <Content>
        {content ? (
          <TabContent content={content} onChange={onChange} onGo={generateWorld} />
        ) : (
          'There was an error finding the settings.'
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  grid-area: sidebar;

  padding: 1em 2em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Content = styled.div`
  border: 1px solid ${getColor('white')};
  border-top: 0;
  min-height: 20em;
  box-sizing: border-box;
  padding: 0.5em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
`;
