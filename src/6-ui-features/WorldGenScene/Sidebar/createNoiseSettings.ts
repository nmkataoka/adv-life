import { SliderOptionProps } from './SliderOptions';

export function createNoiseSettings(args: {
  scale: number;
  frequency: number;
  octaves: number;
  lacunarity: number;
  gain: number;
}): SliderOptionProps[] {
  const { scale, frequency, octaves, lacunarity, gain } = args;
  const scaleSettings = {
    name: 'Scale',
    description: 'Altitude of the noise: [-scale, scale)',
    defaultVal: scale,
    min: scale / 10,
    max: scale * 10,
    step: scale / 10,
  };
  const freqSettings = {
    name: 'Frequency',
    description: 'Frequency of the noise',
    defaultVal: frequency,
    min: frequency / 10,
    max: frequency * 10,
    step: frequency / 10,
  };
  const octaveSettings = {
    name: 'Octaves',
    description: 'More octaves means the noise is computed at higher resolution.',
    defaultVal: octaves,
    min: 1,
    max: 12,
    step: 1,
  };
  const lacunaritySettings = {
    name: 'Lacunarity',
    description: 'How much the frequency increases with each octave. Usually around 2.',
    defaultVal: lacunarity,
    min: 1.5,
    max: 2.5,
    step: 0.05,
  };
  const gainSettings = {
    name: 'Gain',
    description: 'How much the scale is decreased with each octave. Usually around 0.5.',
    defaultVal: gain,
    min: 0.3,
    max: 0.7,
    step: 0.05,
  };

  return [scaleSettings, freqSettings, octaveSettings, lacunaritySettings, gainSettings];
}
