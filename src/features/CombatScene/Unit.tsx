/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import HealthBar from "./HealthBar";

type UnitProps = {
  isEnemy?: boolean;
};

export default function Unit({ isEnemy }: UnitProps) {
  return (
    <Container>
      <HealthBar health={0.8} />
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
