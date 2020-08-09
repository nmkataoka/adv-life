export type OneOfData = {
  label: string;
  info: string;
}

export type PointAllocationData = {
  label: string;
  info: string;
  value: number;
  min: number;
  max: number;
}

export type RangeData = {
  minLabel: string;
  maxLabel: string;
  info: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export type CharacterAttributeGroupOneOf = {
  name: string;
  selectType: 'oneOf';
  options: OneOfData[];
}

export type CharacterAttributeGroupPointAllocation = {
  name: string;
  selectType: 'pointAllocation';
  options: PointAllocationData[];
  totalPoints: number;
}

export type CharacterAttributeGroupRanges = {
  name: string;
  selectType: 'ranges';
  options: RangeData[];
}

export type CharacterAttributeGroup = CharacterAttributeGroupOneOf
| CharacterAttributeGroupPointAllocation
| CharacterAttributeGroupRanges;
