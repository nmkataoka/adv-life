import React from 'react';
import SelectionWindow from '../components/SelectionWindow';

const classOptions = [
  { label: 'Fighter', info: 'A front line warrior.' },
  { label: 'Mage', info: 'A scholar of the arcane.' },
  { label: 'Thief', info: 'A quick and crafty scoundrel.' },
];

export default function ClassSelection(): JSX.Element {
  return (
    <SelectionWindow header="Class" options={classOptions} />
  );
}
