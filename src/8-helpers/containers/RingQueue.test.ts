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
});
