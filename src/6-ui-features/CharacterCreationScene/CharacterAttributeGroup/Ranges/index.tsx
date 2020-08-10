export type RangeData = {
  minLabel: string;
  maxLabel: string;
  info: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export type Ranges = {
  name: string;
  selectType: 'ranges';
  options: RangeData[];
}

export const randomize = (info: Ranges): Ranges => {
  const { options } = info;
  for (let i = 0; i < options.length; ++i) {
    const { max, min } = options[i];
    const range = max - min + 1;
    options[i].value = Math.floor(Math.random() * range) + min;
  }
  return info;
};
