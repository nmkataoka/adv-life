import { EntityManager, isEqual, NComponent } from '0-engine';
import { commit, componentNode, createCacheState, read, selectorNode } from './node';

class TestComponent extends NComponent {
  num = 0;
}

describe('node', () => {
  const setUp = () => {
    const eMgr = new EntityManager();

    const cacheState = createCacheState();

    const e1 = eMgr.createEntity();
    const c1 = new TestComponent();
    c1.num = 1;
    eMgr.addCmpt(e1, c1);

    const e2 = eMgr.createEntity();
    const c2 = new TestComponent();
    c2.num = 2;
    eMgr.addCmpt(e2, c2);

    const cNode1 = componentNode(TestComponent, e1);
    const cNode2 = componentNode(TestComponent, e2);

    const s = selectorNode({
      get: ({ get }) => {
        const [{ num: num1 } = { num: -1 }] = get(cNode1);
        const [{ num: num2 } = { num: -1 }] = get(cNode2);
        return `${num1},${num2}`;
      },
    });

    return { cacheState, e1, c1, e2, c2, eMgr, cNode1, cNode2, s };
  };

  it('component read returns correct value', () => {
    const { cacheState, cNode1, eMgr } = setUp();

    const [val] = read(cacheState, eMgr, cNode1);
    expect(val?.num).toBe(1);
  });

  it('selector read returns correct value', () => {
    const { cacheState, cNode1, cNode2, eMgr } = setUp();
    const s = selectorNode({
      get: ({ get }) => {
        const [{ num: num1 } = { num: -1 }] = get(cNode1);
        const [{ num: num2 } = { num: -1 }] = get(cNode2);
        return `${num1},${num2}`;
      },
    });
    const [val] = read(cacheState, eMgr, s);
    expect(val).toEqual('1,2');
  });

  it('component returns same reference if value is the same', () => {
    const { cacheState, cNode1, eMgr } = setUp();
    const val = read(cacheState, eMgr, cNode1);
    commit(cacheState);
    const valLater = read(cacheState, eMgr, cNode1);
    expect(isEqual(valLater, val)).toBe(true);
  });

  it('selector returns same reference if value is the same', () => {
    const { cacheState, eMgr, s } = setUp();

    const val = read(cacheState, eMgr, s);
    commit(cacheState);
    const valLater = read(cacheState, eMgr, s);
    expect(isEqual(valLater, val));
  });

  it('component returns different reference if mutated', () => {
    const { cacheState, cNode1, e1, eMgr } = setUp();
    const val = read(cacheState, eMgr, cNode1);
    commit(cacheState);
    const c = eMgr.getCmptMut(TestComponent, e1);
    c.num = 5;
    const valLater = read(cacheState, eMgr, cNode1);
    expect(isEqual(valLater, val));
  });

  it('selector returns different reference if an upstream reference is mutated', () => {
    const { cacheState, eMgr, e1, s } = setUp();
    const val = read(cacheState, eMgr, s);
    commit(cacheState);
    const c = eMgr.getCmptMut(TestComponent, e1);
    c.num = 5;
    const valLater = read(cacheState, eMgr, s);
    expect(isEqual(valLater, val));
  });
});
