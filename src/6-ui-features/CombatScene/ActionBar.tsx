/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { ActionInfo } from "./ActionInfo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../7-app/store";
import { selectedAction } from "./combatSceneSlice";

export default function ActionBar() {
  const actions = useSelector((state: RootState) => state.combatScene.actions);
  return (
    <Container>
      {actions.map((a) => (
        <ActionButton key={a.name} actionInfo={a} />
      ))}
    </Container>
  );
}

type ActionButtonProps = {
  actionInfo: ActionInfo;
};

function ActionButton({ actionInfo }: ActionButtonProps) {
  const dispatch = useDispatch();
  const { displayText } = actionInfo;

  const handleClick = () => {
    dispatch(selectedAction(actionInfo));
  };

  return <ActionButtonContainer onClick={handleClick}>{displayText}</ActionButtonContainer>;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5em 1em;
  background-color: gold;
  position: absolute;
  bottom: 0;
`;

const ActionButtonContainer = styled.div`
  border-radius: 4px;
  background-color: brown;
  color: white;
  margin-right: 0.5em;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
`;
