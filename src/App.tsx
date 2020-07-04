/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';
import CombatScene from './6-ui-features/CombatScene';
import TopBar from './6-ui-features/CombatScene/TopBar';
import { GameManager } from './0-engine/GameManager';

function App(): JSX.Element {
  useEffect(() => {
    GameManager.instance.Start();

    // Only start once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      css={css`
        width: 80vw;
      `}
    >
      <TopBar />
      <CombatScene />
    </div>
  );
}

export default App;
