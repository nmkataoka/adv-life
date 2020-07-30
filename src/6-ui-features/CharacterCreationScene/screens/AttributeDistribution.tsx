import React from 'react';
import { AttributeRowProps } from '../components/AttributeRow';
import AttributeWindow from '../components/AttributeWindow';

const attributes: AttributeRowProps[] = [
  {
    label: 'Strength', value: 10, min: 0, max: 20, onIncrease: () => undefined, onDecrease: () => undefined,
  },
  {
    label: 'Dexterity', value: 10, min: 0, max: 20, onIncrease: () => undefined, onDecrease: () => undefined,
  },
  {
    label: 'Intellect', value: 10, min: 0, max: 20, onIncrease: () => undefined, onDecrease: () => undefined,
  },
];

export default function AttributeDistribution(): JSX.Element {
  return <AttributeWindow header="Attributes" attributes={attributes} />;
}
