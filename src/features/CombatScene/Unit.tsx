/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import HealthBar from "./HealthBar";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

type UnitProps = {
  handle: number;
};

export default function Unit({ handle }: UnitProps) {
  const { health, maxHealth, isEnemy } = useSelector(
    (state: RootState) => state.combatScene.units[handle]
  );

  return (
    <Container>
      <HealthBar health={health / maxHealth} />
      <Circle isEnemy={isEnemy}>UNIT</Circle>
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
};

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props: CircleProps) =>
    props.isEnemy ? "red" : "lightblue"};
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;
