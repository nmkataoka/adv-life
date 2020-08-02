import React from 'react';

import SelectionWindow from '../components/SelectionWindow';

const raceOptions = [
  { label: 'Human', info: "A boring choice that you surely won't choose." },
  { label: 'Elf', info: 'Tree lovers.' },
  { label: 'Dwarf', info: 'Short and stocky miners who consume an abundance of alcohol.' },
  { label: 'Goblin', info: 'Even shorter.' },
];

export default function RaceSelection(): JSX.Element {
  return (
    <SelectionWindow
      header="Race"
      options={raceOptions}
    />
  );
}
