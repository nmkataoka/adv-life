import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { updateInfoWindow } from '../characterCreationSlice';

export type AttributeRowProps = {
  info: string;
  label: string;
  value: number;
  min?: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function AttributeRow({ info, label, value }: AttributeRowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(updateInfoWindow({ infoWindowTitle: label, infoWindowText: info }));
  };

  return (
    <Row>
      <Label onClick={handleClick}>{label}</Label>
      <Value>{value}</Value>
      <IncrementButton>-</IncrementButton>
      <IncrementButton>+</IncrementButton>
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
