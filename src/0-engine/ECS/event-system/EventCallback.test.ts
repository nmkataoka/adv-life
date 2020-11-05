import { EventCallbackError } from './EventCallback';

describe('EventCallbackError', () => {
  it('constructs message properly', () => {
    const message = 'an error';
    const err = new EventCallbackError(message);
    expect(err.message).toBe(message);
    expect(err.toString()).toBe(message);
  });
});
