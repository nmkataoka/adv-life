import React from 'react';
import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';

const terrainOptions: SliderOptionProps[] = [
  { name: 'Width (tiles)', min: 100, max: 1000, step: 50 },
  { name: 'Height (tiles)', min: 100, max: 1000, step: 50 },
  { name: 'Tectonic Plates', min: 5, max: 30, step: 1 },
];

type SliderOptionProps = {
  name: string;
  min: number;
  max: number;
  step: number;
};

function SliderOption({ name, min, max, step }: SliderOptionProps): JSX.Element {
  return (
    <tr>
      <td>{name}</td>
      <MinCell>{min}</MinCell>
      <td>
        <input type="range" min={min} max={max} step={step} onChange={() => {}} value={min} />
      </td>
      <td>{max}</td>
    </tr>
  );
}

const MinCell = styled.td`
  text-align: right;
`;

export function TerrainGenControls(): JSX.Element {
  return (
    <>
      <Table>
        <colgroup>
          <col span={1} style={{ width: '50%' }} />
          <col span={1} style={{ width: '10%' }} />
          <col span={1} style={{ width: '30%' }} />
          <col span={1} style={{ width: '10%' }} />
        </colgroup>
        {terrainOptions.map(({ name, min, max, step }) => (
          <SliderOption key={name} name={name} min={min} max={max} step={step} />
        ))}
      </Table>
      <LastRow>
        <PrimaryButton>Go!</PrimaryButton>
      </LastRow>
    </>
  );
}

const Table = styled.table`
  margin: 0 0.5em;

  & td {
    padding: 0.25em 0;
  }
`;

const LastRow = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: flex-end;
`;
