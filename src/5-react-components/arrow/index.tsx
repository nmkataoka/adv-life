// Draw an arrow from the center of an element to the cursor position

import React from "react";

export type Point = {
  x: number;
  y: number;
};

type ArrowProps = {
  from: Point; // MutableRefObject<undefined>;
  to: Point;
};

export default function Arrow({ from, to }: ArrowProps) {
  return (
    <svg style={{ height: "300px", width: "400px", top: "0", left: "0", position: "absolute" }}>
      <defs>
        <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#000000" }} />
        </marker>
      </defs>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        markerEnd={"url(#markerArrow)"}
        style={{ stroke: "red", strokeWidth: 2 }}
      />
    </svg>
  );
}
