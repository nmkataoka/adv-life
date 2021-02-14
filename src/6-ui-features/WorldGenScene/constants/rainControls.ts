import { TabContentProps } from '../Sidebar/TabContent';

export const rainControls: TabContentProps['content'] = [
  {
    heading: 'Rain Settings',
    options: [
      {
        name: 'Height (m)',
        key: 'height',
        description:
          'Drop height. You can think of it as a measurement of rainfall. Primarily affects how much erosion occurs per iteration.',
        value: 6.4e2,
        min: 6.4e2,
        max: 6.4e5,
        step: 6.4e2,
        isLogarithmic: true,
      },
      {
        name: 'Dt (s)',
        key: 'dt',
        description:
          'Timestep. Recommended to set this such that fast moving water moves about 1 tile per tick.',
        value: 1,
        min: 1,
        max: 1000,
        step: 1,
      },
      {
        name: 'Evaporation Rate (m/s)',
        key: 'evapRate',
        description: 'Rate at which stagnant water evaporates.',
        value: 0.05,
        min: 1e-2,
        max: 0.1,
        step: 0.001,
        isLogarithmic: true,
      },
      {
        name: 'Deposition Rate (?)',
        key: 'depositionRate',
        description: 'Rate at which sediment deposits from stagnant water.',
        value: 0.08,
        min: 0.01,
        max: 0.8,
        step: 0.01,
      },
      {
        name: 'Minimum Drop Height (m)',
        key: 'minHeight',
        description: 'When the drop height falls below this, it is considered fully evaporated.',
        value: 0.01,
        min: 0.001,
        max: 0.1,
        step: 0.001,
      },
      {
        name: 'Friction Factor (1/m)',
        key: 'friction',
        description:
          'Friction between droplet and ground. This is the laminar friction factor, which is unitless, divided by the pipe diameter in m.',
        value: 0.01,
        min: 0.001,
        max: 1,
        step: 0.001,
      },
      {
        name: 'Number of Drops',
        key: 'numDrops',
        description: 'How many rain drops to rain.',
        value: 50,
        min: 1,
        max: 10000,
        step: 1,
      },
    ],
  },
];
