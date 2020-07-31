import React from 'react';
import SliderWindow from '../components/SliderWindow';

const personalityLabels = [
  ['Dishonest-Greedy', 'Honest-Humble'],
  ['Stoic', 'Emotional'],
  ['Introverted', 'Extraverted'],
  ['Stubborn-Angry', 'Agreeable'],
  ['Irresponsible', 'Conscientious'],
  ['Closed to Experience', 'Open to Experience'],
];

const initialPersonality = personalityLabels.map(([minLabel, maxLabel]) => ({
  maxLabel,
  minLabel,
  value: 3,
  min: 1,
  max: 5,
  onChange: () => undefined,
  step: 1,
}));

export default function PersonalityCreation(): JSX.Element {
  return <SliderWindow header="Personality" sliders={initialPersonality} />;
}
