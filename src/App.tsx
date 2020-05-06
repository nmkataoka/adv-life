/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import CombatScene from "./features/CombatScene";
import TopBar from "./features/CombatScene/TopBar";

function App() {
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
