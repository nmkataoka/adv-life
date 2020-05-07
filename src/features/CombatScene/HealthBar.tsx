/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

type HealthBarProps = {
  health: number;
};

export default function HealthBar({ health }: HealthBarProps) {
  return (
    <Container>
      <Health style={{ width: (health * 100).toFixed(0) + "%" }} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100px;
  height: 20px;
  border: 1px solid gray;
`;

const Health = styled.div`
  background-color: red;
`;
