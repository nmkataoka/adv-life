import { NComponent } from '../../../0-engine/ECS/NComponent';
import { EntityManager } from '../../../0-engine/ECS/EntityManager';
import { createEmptyEntityManager } from '../../../0-engine/ECS/test-helpers/CreateEntityManager';
import EntityTemplate from './EntityTemplate';

class Component1 implements NComponent {}
class Component2 implements NComponent {}
class Component3 implements NComponent {}
class Component4 implements NComponent {}

describe('EntityTemplate', () => {
  let eMgr: EntityManager;

  beforeEach(() => {
    eMgr = createEmptyEntityManager();
  });

  it('findCandidateEntities should find all entities with matching components', () => {
    const entities = [];
    for (let i = 0; i < 10; ++i) {
      const e = eMgr.CreateEntity();
      entities.push(e);
      if (i % 2 === 0) {
        eMgr.AddComponent(e, new Component1());
      } else {
        eMgr.AddComponent(e, new Component2());
      }
    }

    const entityTemplate = new EntityTemplate(Component1);
    const candidates1 = entityTemplate.findCandidateEntities();
    expect(candidates1.length).toBe(5);

    // The first entity index is 1, not 0
    expect(candidates1).toEqual([1, 3, 5, 7, 9]);
  });

  it('checkValid should succeed on valid entity with single component', () => {
    const entityTemplate = new EntityTemplate(Component1);
    const e = eMgr.CreateEntity();
    eMgr.AddComponent(e, new Component1());
    expect(entityTemplate.checkValid(e.handle, eMgr)).toBe(true);
  });

  it('checkValid should fail on entities missing required components', () => {
    const entityTemplate = new EntityTemplate(Component1);
    const e = eMgr.CreateEntity();
    eMgr.AddComponent(e, new Component2());
    expect(entityTemplate.checkValid(e.handle, eMgr)).toBe(false);
  });

  it('checkValid should succeed on valid entity with multiple components', () => {
    const entityTemplate1 = new EntityTemplate(Component1);
    const entityTemplate3 = new EntityTemplate(Component3);
    const entityTemplate13 = new EntityTemplate(Component1, Component3);
    const entityTemplate134 = new EntityTemplate(Component1, Component3, Component4);

    const e = eMgr.CreateEntity();
    eMgr.AddComponent(e, new Component1());
    eMgr.AddComponent(e, new Component3());
    eMgr.AddComponent(e, new Component4());

    expect(entityTemplate1.checkValid(e.handle, eMgr)).toBe(true);
    expect(entityTemplate3.checkValid(e.handle, eMgr)).toBe(true);
    expect(entityTemplate13.checkValid(e.handle, eMgr)).toBe(true);
    expect(entityTemplate134.checkValid(e.handle, eMgr)).toBe(true);
  });

  it('checkValid should fail on invalid entities with multiple components', () => {
    const entityTemplate1 = new EntityTemplate(Component1);
    const entityTemplate13 = new EntityTemplate(Component1, Component3);
    const entityTemplate34 = new EntityTemplate(Component3, Component4);
    const entityTemplate234 = new EntityTemplate(Component2, Component3, Component4);

    const e = eMgr.CreateEntity();
    eMgr.AddComponent(e, new Component2());
    eMgr.AddComponent(e, new Component4());

    expect(entityTemplate1.checkValid(e.handle, eMgr)).toBe(false);
    expect(entityTemplate13.checkValid(e.handle, eMgr)).toBe(false);
    expect(entityTemplate34.checkValid(e.handle, eMgr)).toBe(false);
    expect(entityTemplate234.checkValid(e.handle, eMgr)).toBe(false);
  });
});