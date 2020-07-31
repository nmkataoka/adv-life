import React from 'react';
import styled from '@emotion/styled';

export type SliderRowProps = {
  max: number
  maxLabel: string,
  min: number,
  minLabel: string,
  onChange: () => void;
  step: number,
  value: number,
}

export default function SliderRow({
  max, maxLabel, min, minLabel, onChange, step, value,
}: SliderRowProps): JSX.Element {
  return (
    <Row>
      <Label style={{ textAlign: 'right' }}>{minLabel}</Label>
      <Input
        type="range"
        min={min}
        max={max}
        onChange={onChange}
        step={step}
        value={value}
      />
      <Label>{maxLabel}</Label>
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
