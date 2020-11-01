import { OneOf, randomize as randomizeOneOf } from './OneOf';
import { PointAllocation, randomize as randomizePointAllocation } from './PointAllocation';
import { Ranges, randomize as randomizeRanges } from './Ranges';
import { Freeform, randomize as randomizeFreeform } from './Freeform';

type CharacterAttributeGroup = Freeform | OneOf | PointAllocation | Ranges;

export default CharacterAttributeGroup;

export type { Freeform, OneOf, PointAllocation, Ranges };

export const randomize = (info: CharacterAttributeGroup): CharacterAttributeGroup => {
  if (info.selectType === 'freeform') {
    return randomizeFreeform(info);
  }
  if (info.selectType === 'oneOf') {
    return randomizeOneOf(info);
  }
  if (info.selectType === 'pointAllocation') {
    return randomizePointAllocation(info);
  }
  return randomizeRanges(info);
};
