/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import HealthBar from "./HealthBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../7-app/store";
import { setUnitAttackTarget, clickedOnUnit } from "./combatSceneSlice";

type UnitProps = {
  handle: number;
};

export default function Unit({ handle }: UnitProps) {
  const { health, maxHealth, isEnemy } = useSelector(
    (state: RootState) => state.combatScene.units[handle]
  );
  const selectedUnit = useSelector((state: RootState) => state.combatScene.selectedUnit);
  const dispatch = useDispatch();

  const handleUnitClick = () => {
    if (selectedUnit && isEnemy) {
      setUnitAttackTarget(selectedUnit, handle);
    }
    dispatch(clickedOnUnit(handle));
  };

  return (
    <Container>
      <HealthBar health={health / maxHealth} />
      <Circle isEnemy={isEnemy} onClick={handleUnitClick} isSelected={selectedUnit === handle}>
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
