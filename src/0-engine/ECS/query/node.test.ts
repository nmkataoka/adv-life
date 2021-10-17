import { EntityManager, isEqual, NComponent } from '0-engine';
import {
  commit,
  componentNode,
  createCacheState,
  read,
  selectorNode,
  uniqueComponentNode,
} from './node';

class TestComponent extends NComponent {
  num = 0;
}

class UniqueComponent extends NComponent {
  uniqueNum = 0;
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

    const c3 = new UniqueComponent();
    c3.uniqueNum = 3;
    eMgr.addCmpt(e2, c3);

    const cNode1 = componentNode(TestComponent, e1);
    const cNode2 = componentNode(TestComponent, e2);

    const cNode3 = uniqueComponentNode(UniqueComponent);

    const s = selectorNode({
      get: ({ get }) => {
        const [{ num: num1 } = { num: -1 }] = get(cNode1);
        const [{ num: num2 } = { num: -1 }] = get(cNode2);
        const [{ uniqueNum: num3 } = { uniqueNum: -1 }] = get(cNode3);
        return { num1, num2, num3 };
      },
    });

    return { cacheState, e1, c1, e2, c2, eMgr, cNode1, cNode2, cNode3, s };
  };

  it('component read returns correct value', () => {
    const { cacheState, cNode1, eMgr } = setUp();

    const [val] = read(cacheState, eMgr, cNode1);
    expect(val?.num).toBe(1);
  });

  it('selector read returns correct value', () => {
    const { cacheState, s, eMgr } = setUp();
    const [val] = read(cacheState, eMgr, s);
    expect(val).toEqual({ num1: 1, num2: 2, num3: 3 });
  });

  it('unique compoent read returns correct value', () => {
    const { cacheState, cNode3, eMgr } = setUp();
    const [val] = read(cacheState, eMgr, cNode3);
    expect(val?.uniqueNum).toBe(3);
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
    expect(isEqual(valLater, val)).toBe(true);
  });

  it('unique component returns same reference if value is the same', () => {
    const { cacheState, eMgr, cNode3 } = setUp();
    const val = read(cacheState, eMgr, cNode3);
    commit(cacheState);
    const valLater = read(cacheState, eMgr, cNode3);
    expect(isEqual(valLater, val)).toBe(true);
  });

  it('component returns different reference if mutated', () => {
    const { cacheState, cNode1, e1, eMgr } = setUp();
    const val = read(cacheState, eMgr, cNode1);
    commit(cacheState);
    const c = eMgr.getCmptMut(TestComponent, e1);
    c.num = 5;
    const valLater = read(cacheState, eMgr, cNode1);
    expect(isEqual(valLater, val)).toBe(false);
  });

  it('selector returns different reference if an upstream reference is mutated', () => {
    const { cacheState, eMgr, e1, s } = setUp();
    const val = read(cacheState, eMgr, s);
    commit(cacheState);
    const c = eMgr.getCmptMut(TestComponent, e1);
    c.num = 5;
    const valLater = read(cacheState, eMgr, s);
    expect(isEqual(valLater, val)).toBe(false);
  });
});
