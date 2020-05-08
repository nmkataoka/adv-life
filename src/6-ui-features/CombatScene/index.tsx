/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Unit from "./Unit";
import ActionBar from "./ActionBar";
import { useSelector } from "react-redux";
import { RootState } from "../../7-app/store";

export default function CombatScene() {
  const units = useSelector((state: RootState) => state.combatScene.units);
  const enemies = Object.values(units).filter((u) => u.isEnemy);
  const friendlies = Object.values(units).filter((f) => !f.isEnemy);

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
          <Unit key={e.entityHandle} handle={e.entityHandle}></Unit>
        ))}
      </div>
      <div
        css={css`
          width: 100%;
          border-bottom: 3px solid gray;
        `}
      />
      <div css={row}>
        {friendlies.map((p) => (
          <Unit key={p.entityHandle} handle={p.entityHandle}></Unit>
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
