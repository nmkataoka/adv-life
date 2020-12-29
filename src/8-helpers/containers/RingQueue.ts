import assert from 'assert';

/** Performant queue class that uses an array underneath */
export class RingQueue<T> {
  /** Clears the queue, may or may not free memory */
  clear = (): void => {
    this.frontIdx = 0;
    this.firstEmptyIdx = 0;
    this.count = 0;
  };

  /** Returns the front item in the queue.
   * If ring queue is empty, this is undefined behavior.
   */
  front = (): T => this.arr[this.frontIdx];

  /** Returns true if queue is empty */
  isEmpty = (): boolean => this.size() === 0;

  /** Adds an item to the back of the queue */
  push = (item: T): void => {
    // Resize queue if necessary
    if (this.count === this.capacity() - 1) {
      this.resize(this.capacity() * 2);
    }
    this.arr[this.firstEmptyIdx++] = item;

    // If we have wrapped around the end of the vector
    if (this.firstEmptyIdx >= this.capacity()) {
      this.firstEmptyIdx = 0;
    }
    ++this.count;
  };

  /** Pops the front item from the queue */
  pop = (): T => {
    assert(this.size() > 0);

    // Swap return element with a dummy element
    // This doesn't really work in javascript, so let's just leave the element there
    // Obj o;
    // std::swap(o, front());
    const val = this.front();
    ++this.frontIdx;
    if (this.frontIdx >= this.capacity()) {
      this.frontIdx = 0;
    }
    --this.count;
    return val;
  };

  /** Returns the current number of elements in the queue */
  size = (): number => this.count;

  /** Returns the size of the underlying array */
  capacity = (): number => this.arr.length;

  constructor() {
    this.arr = new Array(4);
    this.frontIdx = 0;
    this.firstEmptyIdx = 0;
    this.count = 0;
  }

  /** Constructs a ring queue from an array */
  static fromArray<C>(arr: C[]): RingQueue<C> {
    const ringQueue = new RingQueue<C>();
    arr.forEach((el) => ringQueue.push(el));
    return ringQueue;
  }

  toString = (): string => {
    return this.arr.toString();
  };

  /** Resizes the underlying array to hold more elements */
  private resize = (newCapacity: number): void => {
    if (newCapacity <= this.capacity()) {
      return;
    }
    const newArr: T[] = new Array(newCapacity);
    let i = this.frontIdx;
    let processed = 0;
    const numElements = this.size();
    for (i = this.frontIdx; i < this.arr.length && processed < numElements; ++i) {
      newArr[processed] = this.arr[i];
      ++processed;
    }
    for (i = 0; processed < numElements; ++i) {
      newArr[processed] = this.arr[i];
      ++processed;
    }
    // Pad the queue with empty elements
    // This is unnecessary and also impossible in javascript
    // for(; processed < newCapacity; ++processed) {
    //     newRingQueue.push();
    // }
    this.frontIdx = 0;
    this.firstEmptyIdx = numElements;
    this.arr = newArr;
  };

  private arr: T[];

  private frontIdx: number;

  private firstEmptyIdx: number;

  private count: number;
}
