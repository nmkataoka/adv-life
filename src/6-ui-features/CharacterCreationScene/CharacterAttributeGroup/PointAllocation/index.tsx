export type PointAllocationData = {
  label: string;
  info: string;
  value: number;
  min: number;
  max: number;
}

export type PointAllocation = {
  name: string;
  selectType: 'pointAllocation';
  options: PointAllocationData[];
  totalPoints: number;
}

// Sets all attributes to 0 then randomly increments them until it runs out of points
export const randomize = (info: PointAllocation): PointAllocation => {
  const { options } = info;
  const totalPointsToAllocate = info.totalPoints;
  let totalRange = 0;
  for (let i = 0; i < info.options.length; ++i) {
    const { min, max } = options[i];
    const range = max - min;
    totalRange += range;
    options[i].value = min;
  }

  let allocatedPoints = 0;
  while (allocatedPoints < totalPointsToAllocate && allocatedPoints < totalRange) {
    const i = Math.floor(Math.random() * options.length);
    const { max, value } = options[i];
    if (value < max) {
      options[i].value += 1;
      allocatedPoints += 1;
    }
  }

  return info;
};
