/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CombatScene from './6-ui-features/CombatScene';
import TopBar from './6-ui-features/CombatScene/TopBar';
import { GameManager } from './0-engine/GameManager';
import { updateUnitsFromEngine } from './6-ui-features/CombatScene/combatSceneSlice';

const uiInterval = 200;

function App() {
  const [uiLoopHandle, setUiLoopHandle] = useState(null as NodeJS.Timeout | null);

  const dispatch = useDispatch();

  const startUILoop = useCallback(() => {
    if (uiLoopHandle) clearTimeout(uiLoopHandle);

    const handle = setTimeout(() => {
      dispatch(updateUnitsFromEngine());
      startUILoop();
    }, uiInterval);
    setUiLoopHandle(handle);
  }, [uiLoopHandle, dispatch]);

  useEffect(() => {
    GameManager.instance.Start();
    startUILoop();

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
