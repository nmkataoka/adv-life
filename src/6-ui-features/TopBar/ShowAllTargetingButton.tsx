import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setShowAllTargeting } from '../CombatScene/combatSceneSlice';
import { RootState } from '7-app/types';

export default function ShowAllTargetingButton(): JSX.Element {
  const dispatch = useDispatch();
  const showAllTargeting = useSelector((state: RootState) => state.combatScene.showAllTargeting);

  const handleToggle = useCallback(() => {
    dispatch(setShowAllTargeting(!showAllTargeting));
  }, [dispatch, showAllTargeting]);

  return <Button onClick={handleToggle} showAllTargeting={showAllTargeting}>Targeting</Button>;
}

type ButtonProps = {
  showAllTargeting: boolean;
}

const Button = styled.div`
  align-items: center;
  background-color: ${(props: ButtonProps) => (props.showAllTargeting ? 'lightblue' : 'red')};
  border-radius: 4px;
  display: flex;
  font-size: 1.8em;
  height: 50px;
  justify-content: center;
  margin: 0 10px;
  padding: 0 1em;
  user-select: none;
  

  &:hover {
    cursor: pointer;
  }
`;
