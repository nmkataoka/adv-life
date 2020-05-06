/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Unit from "./Unit";
import ActionBar from "./ActionBar";

const enemies = [0, 1, 2];
const players = [0, 1, 2];

export default function CombatScene() {
  return (
    <div
      css={css`
        width: 100%;
        min-height: 70vh;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-content: center;
      `}
    >
      <div css={row}>
        {enemies.map((e) => (
          <Unit key={e} isEnemy></Unit>
        ))}
      </div>
      <div
        css={css`
          width: 100%;
          border-bottom: 3px solid gray;
        `}
      />
      <div css={row}>
        {players.map((p) => (
          <Unit key={p}></Unit>
        ))}
      </div>
      <ActionBar />
    </div>
  );
}

const row = css`
  display: flex;
  justify-content: space-between;
  padding: 2em 4em;
`;
