import { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { updateInfoWindow, changedSlider } from '../../characterCreationSlice';

export type SliderRowProps = {
  info: string;
  max: number;
  maxLabel: string;
  min: number;
  minLabel: string;
  step: number;
  value: number;
};

export default function SliderRow({
  info,
  max,
  maxLabel,
  min,
  minLabel,
  step,
  value,
}: SliderRowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(updateInfoWindow({ infoWindowTitle: maxLabel, infoWindowText: info }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changedSlider({ label: maxLabel, value: parseInt(e.target.value, 10) }));
  };

  return (
    <Row>
      <Label onClick={handleClick} style={{ textAlign: 'right' }}>
        {minLabel}
      </Label>
      <Input type="range" min={min} max={max} onChange={handleChange} step={step} value={value} />
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
