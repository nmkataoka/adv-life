import { RingQueue } from './RingQueue';

describe('RingQueue', () => {
  it('general test', () => {
    const queue = new RingQueue();
    expect(queue.size()).toBe(0);

    queue.push(1);
    queue.push(3);
    queue.push(5);

    expect(queue.front()).toBe(1);
    expect(queue.size()).toBe(3);

    const el = queue.pop();
    expect(el).toBe(1);
    expect(queue.size()).toBe(2);

    queue.pop();
    queue.pop();
    expect(queue.size()).toBe(0);
  });

  it('resizes as items are added', () => {
    const arr = [0, 1, 2, 3, 4, 5];
    const queue = new RingQueue();
    arr.forEach((el) => queue.push(el));
    expect(queue.size()).toBe(arr.length);
    expect(queue.pop()).toBe(0);
    expect(queue.pop()).toBe(1);
    expect(queue.size()).toBe(arr.length - 2);
  });

  it('constructs from array properly', () => {
    const arr = [0, 1, 2, 3];
    const queue = RingQueue.fromArray(arr);

    expect(queue.size()).toBe(arr.length);
    expect(queue.pop()).toBe(0);
    expect(queue.pop()).toBe(1);
    expect(queue.pop()).toBe(2);
    expect(queue.pop()).toBe(3);
    expect(queue.isEmpty()).toBe(true);
  });
});
