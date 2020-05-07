/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import CombatScene from "./features/CombatScene";
import TopBar from "./features/CombatScene/TopBar";
import { useEffect } from "react";
import { GameManager } from "./engine/GameManager";

function App() {
  useEffect(() => {
    GameManager.instance.Start();
  });

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
