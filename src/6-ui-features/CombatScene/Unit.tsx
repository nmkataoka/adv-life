/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import HealthBar from "./HealthBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../7-app/store";
import { setSkillTarget, clickedOnUnit } from "./combatSceneSlice";
import { useRef } from "react";
import ArrowFromUnit from "./ArrowFromUnit";

type UnitProps = {
  handle: number;
};

export default function Unit({ handle }: UnitProps) {
  const dispatch = useDispatch();
  const { health, maxHealth, isEnemy } = useSelector(
    (state: RootState) => state.combatScene.units[handle]
  );
  const selectedUnit = useSelector((state: RootState) => state.combatScene.selectedUnit);
  const selectedAction = useSelector((state: RootState) => state.combatScene.selectedAction);

  const unitRef = useRef<HTMLDivElement>(null);

  const handleUnitClick = () => {
    if (selectedAction) {
      // TODO: Check if action targets enemy here
      if (selectedUnit && isEnemy) {
        setSkillTarget(selectedUnit, handle, selectedAction);
        dispatch(clickedOnUnit(handle));
      }
    } else {
      dispatch(clickedOnUnit(handle));
    }
  };

  const isSelectedUnit = handle === selectedUnit;
  const showArrowFromUnit = isSelectedUnit && !isEnemy;

  return (
    <Container>
      {showArrowFromUnit && <ArrowFromUnit fromRef={unitRef} />}
      <HealthBar health={health / maxHealth} />
      <Circle
        ref={unitRef}
        isEnemy={isEnemy}
        onClick={handleUnitClick}
        isSelected={selectedUnit === handle}
      >
        UNIT
      </Circle>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type CircleProps = {
  isEnemy?: boolean;
  isSelected?: boolean;
};

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props: CircleProps) => (props.isEnemy ? "red" : "lightblue")};
  ${(props) => props.isSelected && `outline: 2px solid blue;`}
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;
