import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';

export type SliderOptionProps = {
  name: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/** Formats numbers to fit better on screen. Very large or small numbers are displayed in exponential format. */
function toDisplay(num: number): string {
  if (num === 0) return num.toString();

  if (num < 0.01 || num > 9999) return num.toExponential(2);

  // Check if integer
  if (Math.floor(num) === num) return num.toString();

  return num.toFixed(2);
}

function SliderOption({ name, value, min, max, step, onChange }: SliderOptionProps): JSX.Element {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <input type="range" min={min} max={max} step={step} onChange={onChange} value={value} />
      </td>
      <td>{toDisplay(value)}</td>
    </tr>
  );
}

export type SliderOptionsProps = {
  options: Omit<SliderOptionProps, 'onChange'>[];
  onChange: (name: string) => SliderOptionProps['onChange'];
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
        {options.map(({ name, description, value, min, max, step }) => (
          <SliderOption
            key={name}
            name={name}
            description={description}
            value={value}
            min={min}
            max={max}
            step={step}
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
