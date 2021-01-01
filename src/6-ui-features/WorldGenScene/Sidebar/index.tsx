import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';
import produce from 'immer';
import { useDispatch } from '4-react-ecsal';
import { Tabs } from './Tabs';
import { WorldGenTabs } from './constants';
import { TabContent } from './TabContent';
import { createWorld } from './createWorld';

export function Sidebar(): JSX.Element {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(Object.values(WorldGenTabs)[0].key);
  const [contentState, setContentState] = useState(WorldGenTabs);

  const content = contentState.find(({ key }) => key === selectedTab)?.content;
  if (!content) throw new Error('Impossible. This is to make TypeScript happy.');

  const onChange = (heading: string) => (name: string) => (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const nextState = produce(contentState, (draft) => {
      const option = draft
        .find(({ key }) => selectedTab === key)
        ?.content.find(({ heading: h }) => h === heading)
        ?.options.find(({ name: n }) => n === name);
      if (option) {
        if (Math.floor(option.step) === option.step) {
          // Is integer
          option.value = parseInt(e.target.value, 10);
        } else {
          // Is float
          option.value = parseFloat(e.target.value);
        }
      }
    });
    setContentState(nextState);
  };

  const generateWorld = () => {
    void dispatch(createWorld(contentState));
  };

  return (
    <Container>
      <Tabs selected={selectedTab} onChange={setSelectedTab} />
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
