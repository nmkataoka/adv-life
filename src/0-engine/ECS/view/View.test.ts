import { ComponentClasses } from '../component-dependencies/ComponentDependencies';
import { EntityManager } from '../EntityManager';
import { NComponent } from '../NComponent';
import { View } from './View';

class TestCmpt implements NComponent {
  num = 0;
}

describe('View', () => {
  let eMgr: EntityManager;
  let e: number;
  beforeEach(() => {
    eMgr = new EntityManager([]);
    e = eMgr.createEntity();
    eMgr.addCmpt(e, new TestCmpt());
  });

  it('GetView gets a view with one component', () => {
    const view = eMgr.getView(new ComponentClasses({ readCmpts: [TestCmpt] }));
    expect(view.count).toBe(1);
  });

  it('construct view with component managers and no eMgr', () => {
    const componentClasses = new ComponentClasses({ readCmpts: [TestCmpt] });
    const view = new View(componentClasses, undefined, componentClasses.getComponentManagers(eMgr));
    expect(view.count).toBe(1);
  });

  it('throws error if not supplied eMgr or cMgrs', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new View(new ComponentClasses({ readCmpts: [TestCmpt] }));
    }).toThrow();
  });

  it('forEach iterates over all components', () => {
    const e2 = eMgr.createEntity();
    eMgr.addCmpt(e2, new TestCmpt());
    const view = eMgr.getView(new ComponentClasses({ writeCmpts: [TestCmpt] }));
    let i = 1;
    view.forEach((entity, { writeCmpts: [testCmpt] }) => {
      testCmpt.num += i;
      i += 1;
    });
    expect(eMgr.getCmpt(TestCmpt, e).num).toBe(1);
    expect(eMgr.getCmpt(TestCmpt, e2).num).toBe(2);
  });
});
