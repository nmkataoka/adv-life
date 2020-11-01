export type OneOfData = {
  label: string;
  info: string;
};

export type OneOf = {
  name: string;
  selectType: 'oneOf';
  options: OneOfData[];
  selectedIdx: number;
};

export const randomize = (info: OneOf): OneOf => {
  info.selectedIdx = Math.floor(Math.random() * info.options.length);
  return info;
};
