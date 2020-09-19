import wait from './wait';

describe('wait', () => {
  it('waits', async () => {
    const arr = ['a'];
    const promise = wait(5).then(() => {
      arr.push('c');
      expect(arr).toEqual(['a', 'b', 'c']);
    });
    arr.push('b');
    expect(arr).toEqual(['a', 'b']);
    await promise;
  });
});
