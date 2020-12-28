// Removes element at idx by swapping it to the back of the array and deleting it
// Faster delete that doesn't preserve order
export function swapRemoveAt(arr: any[], idx: number): void {
  const { length } = arr;
  if (idx > length) throw new Error('idx out of range');
  arr[idx] = arr[length - 1];
  arr.pop();
}

/** Creates an array with length `size` and all elements with value `value` */
export function initializeArrayWithValue<T>(size: number, value: T): T[] {
  const arr: T[] = new Array(size);
  for (let i = 0; i < size; ++i) {
    arr[i] = value;
  }
  return arr;
}
