import React, { RefObject } from "react";
import Arrow from "../../5-react-components/arrow";
import { useSelector } from "react-redux";
import { RootState } from "../../7-app/store";

type ArrowFromUnitProps = {
  fromRef: RefObject<HTMLDivElement>;
};

export default function ArrowFromUnit({ fromRef }: ArrowFromUnitProps) {
  const mousePos = useSelector((state: RootState) => state.combatScene.mousePosition);
  if (!fromRef || !fromRef.current) return null;
  const el = fromRef.current;
  const { offsetLeft, offsetTop, clientWidth, clientHeight } = el;
  return (
    <Arrow
      from={{ x: offsetLeft + clientWidth / 2, y: offsetTop + clientHeight / 2 }}
      to={mousePos}
    />
  );
}
