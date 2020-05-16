// Draw an arrow from the center of an element to the cursor position

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import useArrowId from './arrowId';

export type Point = {
  x: number;
  y: number;
};

type ArrowProps = {
  from: Point; // MutableRefObject<undefined>;
  to: Point;
};

export default function Arrow({ from, to }: ArrowProps) {
  const arrowId = useArrowId();
  const markerCssId = `markerArrow-${arrowId}`;

  return (
    <svg css={svgCss}>
      <defs>
        <marker id={markerCssId} markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: '#000000' }} />
        </marker>
      </defs>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        markerEnd={`url(#${markerCssId})`}
        style={{ stroke: 'red', strokeWidth: 2 }}
      />
    </svg>
  );
}

const svgCss = css`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 300px;
  width: 400px;
  overflow: visible;
`;
