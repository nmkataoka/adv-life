import React from 'react';
import { AttributeRowProps } from '../components/AttributeRow';
import AttributeWindow from '../components/AttributeWindow';

const attributes: AttributeRowProps[] = [
  {
    label: 'Strength',
    info: 'A measure of physical strength.',
    value: 10,
    min: 0,
    max: 20,
    onIncrease: () => undefined,
    onDecrease: () => undefined,
  },
  {
    label: 'Dexterity',
    info: 'A measure of physical coordination and precision of movement',
    value: 10,
    min: 0,
    max: 20,
    onIncrease: () => undefined,
    onDecrease: () => undefined,
  },
  {
    label: 'Stamina',
    info: 'A measure of how quickly one tires',
    value: 10,
    min: 0,
    max: 20,
    onIncrease: () => undefined,
    onDecrease: () => undefined,
  },
  {
    label: 'Magical Affinity',
    info: 'A measure of whether one is naturally gifted in the arcane arts',
    value: 10,
    min: 0,
    max: 20,
    onIncrease: () => undefined,
    onDecrease: () => undefined,
  },
  {
    label: 'Intelligence',
    info: 'A measure of mental faculties',
    value: 10,
    min: 0,
    max: 20,
    onIncrease: () => undefined,
    onDecrease: () => undefined,
  },
];

export default function AttributeDistribution(): JSX.Element {
  return <AttributeWindow header="Attributes" attributes={attributes} />;
}
