import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import {
  updateInfoWindow,
  increasedPointAllocationForAttribute,
  decreasedPointAllocationForAttribute,
} from '../../characterCreationSlice';

export type AttributeRowProps = {
  info: string;
  label: string;
  value: number;
  min?: number;
  max: number;
};

export default function AttributeRow({ info, label, value }: AttributeRowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(updateInfoWindow({ infoWindowTitle: label, infoWindowText: info }));
  };

  const handleDecrease = () => {
    dispatch(decreasedPointAllocationForAttribute({ label }));
  };

  const handleIncrease = () => {
    dispatch(increasedPointAllocationForAttribute({ label }));
  };

  return (
    <Row>
      <Label onClick={handleClick}>{label}</Label>
      <Value>{value}</Value>
      <IncrementButton onClick={handleDecrease}>-</IncrementButton>
      <IncrementButton onClick={handleIncrease}>+</IncrementButton>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
`;

const Label = styled.span`
  flex: 1 0 auto;
`;

const Value = styled.span`
  margin: 0 0.5em;
`;

const IncrementButton = styled.button`
  padding: 0.25 em;
  border: 1px solid #c0c0c0;
  margin-left: 0.1em;
`;
