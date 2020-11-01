export type FreeformData = {
  label: string;
  type: string;
  value: string;
};

export type Freeform = {
  name: string;
  selectType: 'freeform';
  options: FreeformData[];
};

export const randomize = (info: Freeform): Freeform => info;
