import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { updateInfoWindow } from '../characterCreationSlice';

export type SliderRowProps = {
  info: string;
  max: number;
  maxLabel: string;
  min: number;
  minLabel: string;
  onChange: () => void;
  step: number;
  value: number;
}

export default function SliderRow({
  info, max, maxLabel, min, minLabel, onChange, step, value,
}: SliderRowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(updateInfoWindow({ infoWindowTitle: maxLabel, infoWindowText: info }));
  };

  return (
    <Row>
      <Label onClick={handleClick} style={{ textAlign: 'right' }}>{minLabel}</Label>
      <Input
        type="range"
        min={min}
        max={max}
        onChange={onChange}
        step={step}
        value={value}
      />
      <Label onClick={handleClick}>{maxLabel}</Label>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span`
  flex: 1 0 5em;
  margin: 1em 0.5em;
`;

const Input = styled.input`
  flex: 0 0 auto;
`;
