/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import CombatScene from "./features/CombatScene";
import TopBar from "./features/CombatScene/TopBar";
import { useEffect, useState, useCallback } from "react";
import { GameManager } from "./engine/GameManager";
import { useDispatch } from "react-redux";
import { updateUnitsFromEngine } from "./features/CombatScene/combatSceneSlice";

const delay = 3000;

function App() {
  const [uiLoopHandle, setUiLoopHandle] = useState(
    null as NodeJS.Timeout | null
  );

  const dispatch = useDispatch();

  const startUILoop = useCallback(() => {
    if (uiLoopHandle) clearTimeout(uiLoopHandle);

    const handle = setTimeout(() => {
      updateUnitsFromEngine(dispatch);
      startUILoop();
    }, delay);
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
