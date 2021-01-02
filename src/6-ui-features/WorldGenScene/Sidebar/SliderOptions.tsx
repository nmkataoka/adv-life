import React, { ChangeEvent, useMemo } from 'react';
import styled from '@emotion/styled';

type SliderInputProps = {
  name: string;
  // eslint-disable-next-line react/no-unused-prop-types
  description: string;
  value: number;
  min: number;
  max: number;

  /** For logarithmic sliders, actual step will be log(step) */
  step: number;
  isLogarithmic?: boolean;
  onChange: (num: number) => void;
};

/** Formats numbers to fit better on screen. Very large or small numbers are displayed in exponential format. */
function toDisplay(num: number): string {
  if (num === 0) return num.toString();

  if (num < 0.01 || num > 9999) return num.toExponential(2);

  // Check if integer
  if (Math.floor(num) === num) return num.toString();

  return num.toFixed(2);
}

function isInt(n: number): boolean {
  return Math.floor(n) === n;
}

/** isLogarithmic causes the slider to use a log scale and overwrite `step` with a calculated step */
function SliderInput({
  name,
  value,
  min,
  max,
  step,
  isLogarithmic,
  onChange,
}: SliderInputProps): JSX.Element {
  const isIntegerSlider = useMemo(() => isInt(min) && isInt(max) && isInt(step), [min, max, step]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val: number;
    if (isLogarithmic) {
      // Never intify values for logarithmic sliders because
      // they're more likely to approach integer overflow
      val = Math.exp(parseFloat(e.target.value));
    } else if (isIntegerSlider) {
      // Is integer
      val = parseInt(e.target.value, 10);
    } else {
      // Is float
      val = parseFloat(e.target.value);
    }
    onChange(val);
  };

  let inputMin: number;
  let inputMax: number;
  let inputStep: number;
  let inputVal: number;

  if (isLogarithmic) {
    inputMin = Math.log(min);
    inputMax = Math.log(max);
    inputStep = (inputMax - inputMin) / 10;
    inputVal = Math.log(value);
  } else {
    inputMin = min;
    inputMax = max;
    inputStep = step;
    inputVal = value;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        <input
          type="range"
          min={inputMin}
          max={inputMax}
          step={inputStep}
          onChange={handleChange}
          value={inputVal}
        />
      </td>
      <td>{toDisplay(value)}</td>
    </tr>
  );
}

export type SliderOptionsProps = {
  options: (Omit<SliderInputProps, 'onChange'> & { key: string })[];
  onChange: (name: string) => SliderInputProps['onChange'];
};

export function SliderOptions({ options, onChange }: SliderOptionsProps): JSX.Element {
  return (
    <Table>
      <colgroup>
        <col span={1} style={{ width: 'auto' }} />
        <col span={1} style={{ width: '10em' }} />
        <col span={1} style={{ width: '5em' }} />
      </colgroup>
      <tbody>
        {options.map(({ name, key, description, value, min, max, step, isLogarithmic }) => (
          <SliderInput
            key={key}
            name={name}
            description={description}
            value={value}
            min={min}
            max={max}
            step={step}
            isLogarithmic={isLogarithmic}
            onChange={onChange(name)}
          />
        ))}
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  & td {
    padding: 0.25em 0;
  }
`;
