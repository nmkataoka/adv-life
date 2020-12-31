import React from 'react';
import styled from '@emotion/styled';

export type SliderOptionProps = {
  name: string;
  description: string;
  defaultVal: number;
  min: number;
  max: number;
  step: number;
};

/** Formats numbers to fit better on screen. Very large or small numbers are displayed in exponential format. */
function toDisplay(num: number): string {
  if (num === 0) return num.toString();

  if (num < 0.01 || num > 9999) return num.toExponential(2);

  // Check if integer
  if (Math.floor(num) === num) return num.toString();

  return num.toFixed(2);
}

function SliderOption({ name, defaultVal, min, max, step }: SliderOptionProps): JSX.Element {
  return (
    <tr>
      <td>{name}</td>
      <MinCell>{toDisplay(min)}</MinCell>
      <td>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          onChange={() => {}}
          value={defaultVal}
        />
      </td>
      <td>{toDisplay(max)}</td>
    </tr>
  );
}

const MinCell = styled.td`
  text-align: right;
`;

type SliderOptionsProps = {
  options: SliderOptionProps[];
};

export function SliderOptions({ options }: SliderOptionsProps): JSX.Element {
  return (
    <Table>
      <colgroup>
        <col span={1} style={{ width: 'auto' }} />
        <col span={1} style={{ width: '5em' }} />
        <col span={1} style={{ width: '10em' }} />
        <col span={1} style={{ width: '5em' }} />
      </colgroup>
      <tbody>
        {options.map(({ name, description, defaultVal, min, max, step }) => (
          <SliderOption
            key={name}
            name={name}
            description={description}
            defaultVal={defaultVal}
            min={min}
            max={max}
            step={step}
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
