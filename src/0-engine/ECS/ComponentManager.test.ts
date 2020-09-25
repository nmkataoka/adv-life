import { ComponentManager } from './ComponentManager';
import { NComponent } from './NComponent';

class TestCmpt implements NComponent {
  constructor(health = 100) {
    this.health = health;
  }

  public health: number;
}

describe('component manager', () => {
  it('add components', () => {
    const cMgr = new ComponentManager(TestCmpt);

    const numComponents = 3;
    for (let i = 0; i < numComponents; ++i) {
      cMgr.Add(i, new TestCmpt());
    }
    expect(Object.values(cMgr.components).length).toBe(numComponents);
  });

  it('add and get components', () => {
    const cMgr = new ComponentManager<TestCmpt>(TestCmpt);

    const numComponents = 3;
    for (let i = 0; i < numComponents; ++i) {
      cMgr.Add(i, new TestCmpt(i * 10));
    }

    for (let i = 0; i < numComponents; ++i) {
      const cmpt = cMgr.GetByNumber(i);
      expect(cmpt?.health).toBe(i * 10);
    }
  });
});
