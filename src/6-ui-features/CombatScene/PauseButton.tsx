import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { setIsPaused } from "./combatSceneSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../7-app/store";
import useOnKeypress from "../common/useOnKeypress";
import { Keycodes } from "../common/constants";

export default function PauseButton() {
  const dispatch = useDispatch();
  const isPaused = useSelector((state: RootState) => state.combatScene.isPaused);

  const handleToggle = useCallback(() => {
    dispatch(setIsPaused(!isPaused));
  }, [isPaused, dispatch]);

  const onKeypress = (key: number): void => {
    if (key === Keycodes.Space) {
      handleToggle();
    }
  };

  useOnKeypress(onKeypress);

  return <Circle onClick={handleToggle}>{isPaused ? "\u25b7" : "| |"}</Circle>;
}

const Circle = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8em;
  background-color: lightblue;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;
