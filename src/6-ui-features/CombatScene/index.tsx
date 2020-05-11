/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Unit from "./Unit";
import ActionBar from "./ActionBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../7-app/store";
import { setMousePosition } from "./combatSceneSlice";
import { useRef } from "react";

export default function CombatScene() {
  const units = useSelector((state: RootState) => state.combatScene.units);
  const enemies = Object.values(units).filter((u) => u.isEnemy);
  const friendlies = Object.values(units).filter((f) => !f.isEnemy);
  const dispatch = useDispatch();
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const bounds = sceneRef.current?.getBoundingClientRect();
    if (bounds) {
      dispatch(setMousePosition({ x: clientX - bounds.left, y: clientY - bounds.top }));
    }
  };

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
      onMouseMove={handleMouseMove}
      ref={sceneRef}
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
