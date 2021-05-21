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

// Type guards
export function isOneOf(cag: CharacterAttributeGroup): cag is OneOf {
  return cag.selectType === 'oneOf';
}

export function isFreeform(cag: CharacterAttributeGroup): cag is Freeform {
  return cag.selectType === 'freeform';
}

export function isPointAllocation(cag: CharacterAttributeGroup): cag is PointAllocation {
  return cag.selectType === 'pointAllocation';
}

export function isRanges(cag: CharacterAttributeGroup): cag is Ranges {
  return cag.selectType === 'ranges';
}
