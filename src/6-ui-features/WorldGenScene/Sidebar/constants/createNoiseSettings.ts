import { SliderOptionsProps } from '../SliderOptions';

export function createNoiseSettings(
  keyPrefix: string,
  args: {
    scale: number;
    frequency: number;
    octaves: number;
    lacunarity: number;
    gain: number;
  },
): SliderOptionsProps['options'] {
  const { scale, frequency, octaves, lacunarity, gain } = args;
  const scaleSettings = {
    name: 'Scale',
    key: `${keyPrefix}Scale`,
    description: 'Altitude of the noise: [-scale, scale)',
    value: scale,
    min: scale / 10,
    max: scale * 10,
    step: scale / 10,
  };
  const freqSettings = {
    name: 'Frequency',
    key: `${keyPrefix}Frequency`,
    description: 'Frequency of the noise',
    value: frequency,
    min: frequency / 10,
    max: frequency * 10,
    step: frequency / 10,
  };
  const octaveSettings = {
    name: 'Octaves',
    key: `${keyPrefix}Octaves`,
    description: 'More octaves means the noise is computed at higher resolution.',
    value: octaves,
    min: 1,
    max: 16,
    step: 1,
  };
  const lacunaritySettings = {
    name: 'Lacunarity',
    key: `${keyPrefix}Lacunarity`,
    description: 'How much the frequency increases with each octave. Usually around 2.',
    value: lacunarity,
    min: 1.5,
    max: 2.5,
    step: 0.05,
  };
  const gainSettings = {
    name: 'Gain',
    key: `${keyPrefix}Gain`,
    description: 'How much the scale is decreased with each octave. Usually around 0.5.',
    value: gain,
    min: 0.3,
    max: 0.7,
    step: 0.05,
  };

  return [scaleSettings, freqSettings, octaveSettings, lacunaritySettings, gainSettings];
}
