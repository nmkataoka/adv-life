import { OneOf, randomize as randomizeOneOf } from './OneOf';
import { PointAllocation, randomize as randomizePointAllocation } from './PointAllocation';
import { Ranges, randomize as randomizeRanges } from './Ranges';

type CharacterAttributeGroup = OneOf
| PointAllocation
| Ranges;

export default CharacterAttributeGroup;

export type {
  OneOf,
  PointAllocation,
  Ranges,
};

export const randomize = (info: CharacterAttributeGroup): CharacterAttributeGroup => {
  if (info.selectType === 'oneOf') {
    return randomizeOneOf(info);
  } if (info.selectType === 'pointAllocation') {
    return randomizePointAllocation(info);
  }
  return randomizeRanges(info);
};
