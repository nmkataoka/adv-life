/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import TopBar from './6-ui-features/CombatScene/TopBar';
import { GameManager } from './0-engine/GameManager';
import { Scenes } from './6-ui-features/sceneManager/sceneMetaSlice';

import CombatScene from './6-ui-features/CombatScene';
import TownScene from './6-ui-features/TownScene';
import { RootState } from './7-app/types';

const scenes = {
  [Scenes.Combat]: CombatScene,
  [Scenes.Town]: TownScene,
};

function App(): JSX.Element {
  useEffect(() => {
    GameManager.instance.Start();

    // Only start once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentScene = useSelector((state: RootState) => state.sceneMeta.currentScene);
  const Scene = scenes[currentScene];

  return (
    <div
      css={css`
        width: 80vw;
      `}
    >
      <TopBar />
      <Scene />
    </div>
  );
}

export default App;
