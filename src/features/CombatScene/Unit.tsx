/** @jsx jsx */
import { css, jsx } from "@emotion/core";

type UnitProps = {
  isEnemy?: boolean;
};

export default function Unit({ isEnemy }: UnitProps) {
  return (
    <div
      css={css`
        border-radius: 50%;
        background-color: ${isEnemy ? "red" : "lightblue"};
        min-width: 100px;
        min-height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      `}
    >
      UNIT
    </div>
  );
}
