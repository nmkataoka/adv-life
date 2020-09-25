import { createEmptyEntityManager } from '0-engine/ECS/test-helpers/CreateEntityManager';
import { EntityManager, NComponent } from '0-engine';
import EntityRelationshipTemplate, { IEntityRelationship } from './EntityRelationshipTemplate';

class HasA implements NComponent, IEntityRelationship {
  public ownedObjectEntity = -1;

  public getChildren(): number[] {
    return [this.ownedObjectEntity];
  }
}

describe('EntityRelationshipTemplate', () => {
  let eMgr: EntityManager;

  beforeEach(() => {
    eMgr = createEmptyEntityManager();
  });

  it('checkValid should succeed for a simple HasA relationship', () => {
    const parent = eMgr.CreateEntity();
    const child = eMgr.CreateEntity();

    const hasA = eMgr.AddComponent(parent, HasA);
    hasA.ownedObjectEntity = child;

    const entityRelationshipTemplate = new EntityRelationshipTemplate(HasA);
    expect(entityRelationshipTemplate.checkValid(parent, child, eMgr)).toBe(true);
  });

  it('checkValid should fail if parent lacks EntityRelationship component', () => {
    const parent = eMgr.CreateEntity();
    const child = eMgr.CreateEntity();

    const hasA = eMgr.AddComponent(parent, HasA);
    hasA.ownedObjectEntity = child;

    const entityRelationshipTemplate = new EntityRelationshipTemplate(HasA);
    expect(entityRelationshipTemplate.checkValid(child, parent, eMgr)).toBe(false);
  });

  it('checkValid should fail if relationship does not exist', () => {
    const parent = eMgr.CreateEntity();
    const child = eMgr.CreateEntity();

    eMgr.AddComponent(parent, HasA);

    const entityRelationshipTemplate = new EntityRelationshipTemplate(HasA);
    expect(entityRelationshipTemplate.checkValid(child, parent, eMgr)).toBe(false);
  });
});
