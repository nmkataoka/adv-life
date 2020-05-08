/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import CombatScene from "./6-ui-features/CombatScene";
import TopBar from "./6-ui-features/CombatScene/TopBar";
import { useEffect, useState, useCallback } from "react";
import { GameManager } from "./0-engine/GameManager";
import { useDispatch } from "react-redux";
import { updateUnitsFromEngine } from "./6-ui-features/CombatScene/combatSceneSlice";

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
