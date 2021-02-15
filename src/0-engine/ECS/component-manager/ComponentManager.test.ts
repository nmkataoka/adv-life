import { isEqual, ComponentManager } from './ComponentManager';
import { NComponent } from '../NComponent';

class TestCmpt extends NComponent {
  constructor(health = 100) {
    super();
    this.health = health;
  }

  public health: number;
}

describe('component manager', () => {
  it('add components', () => {
    const cMgr = new ComponentManager(TestCmpt);

    const numComponents = 3;
    for (let i = 0; i < numComponents; ++i) {
      cMgr.add(i, new TestCmpt());
    }
    expect(cMgr.getAsArray().length).toBe(numComponents);
  });

  it('add and get components', () => {
    const cMgr = new ComponentManager<TestCmpt>(TestCmpt);

    const numComponents = 3;
    for (let i = 0; i < numComponents; ++i) {
      cMgr.add(i, new TestCmpt(i * 10));
    }

    for (let i = 0; i < numComponents; ++i) {
      const cmpt = cMgr.getMut(i);
      expect(cmpt?.health).toBe(i * 10);
    }
  });

  it('when component is accessed via immutable ref, mutation tracking detects no change', () => {
    const cMgr = new ComponentManager<TestCmpt>(TestCmpt);

    cMgr.add(0, new TestCmpt());
    const ref1 = cMgr.getWithVersion(0);
    const ref2 = cMgr.getWithVersion(0);
    expect(isEqual(ref1, ref2)).toBe(true);
  });

  it('when component is mutated, mutation tracking detects a change', () => {
    const cMgr = new ComponentManager<TestCmpt>(TestCmpt);
    cMgr.add(0, new TestCmpt());
    const ref1 = cMgr.getWithVersion(0);
    const cmpt = cMgr.getMut(0);
    cmpt.health -= 1;
    const ref2 = cMgr.getWithVersion(0);
    expect(isEqual(ref1, ref2)).toBe(false);
  });
});
