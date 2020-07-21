import { EntityManager } from '../../../0-engine/ECS/EntityManager';
import { swapRemoveAt } from '../../../4-helpers/ArrayExtensions';
import { ComponentTemplateBase } from './ComponentTemplate';
import { EntityTemplateBase } from './EntityTemplate';
import { EntityRelationshipTemplateBase } from './EntityRelationshipTemplate';
import { ComponentComparisonTemplateBase } from './ComponentComparisonTemplate';

export default class ConditionSet {
  // By convention, index 0 must be SELF
  public entityVarNames: string[] = [];

  // Entities have components
  public entityTemplates: EntityTemplateBase[] = [];

  // Checking the components individually
  public componentTemplates: ComponentTemplateBase[][] = [];

  // SUGGESTION: ?entities don't have components. idk if this is necessary but
  // prob isn't difficult to add. Maybe just a "without" number again

  /* entity relationships, indexed by parent OR child
  * Try to minimize these, they are expensive to check.
  *
  * The number is the index of the other entity
  * (e.g. for entityRelationships, the index of the child entity)
  *
  * Relationships/comparisons should only be listed once!
  * They should be listed under the later entity var
  * E.g.:
  * entity variables: [dog, puppy]
  * relationship:      dog IS MOTHER of puppy
  *
  * this relationship should go in entityRelsByChildIdx because
  *      dog entity var idx = 0
  *      puppy entity var id = 1
  * and the later idx is puppy - 1, which is the child
  */
  public entityRelationships: [number, EntityRelationshipTemplateBase][][] = [];

  public entityRelsByChildIdx: [number, EntityRelationshipTemplateBase][][] = [];

  public componentComparisons: [number, ComponentComparisonTemplateBase][][] = [];

  public componentCompsByChildIdx: [number, ComponentComparisonTemplateBase][][] = [];

  // TODO: devise an easier "language" to write condition sets in
  //       and write a translator that will parse them into ConditionSets
  //       so I don't have to think so hard when writing actions
  constructor(numEntities: number) {
    for (let i = 0; i < numEntities; ++i) {
      this.componentTemplates.push([]);
      this.entityRelationships.push([]);
      this.entityRelsByChildIdx.push([]);
      this.componentComparisons.push([]);
      this.componentCompsByChildIdx.push([]);
    }
  }

  // Check whether a specific entityBinding is valid for this ConditionSet
  checkBinding(entityBinding: number[], eMgr: EntityManager): boolean {
    // Empty ConditionSets always match
    if (this.entityTemplates.length === 0) return true;

    // Check that components exist
    for (let i = 0; i < entityBinding.length; ++i) {
      const e = entityBinding[i];
      const entityTemplate = this.entityTemplates[i];
      if (!entityTemplate.checkValid(e, eMgr)) return false;
    }

    // Check individual component predicates
    for (let i = 0; i < entityBinding.length; ++i) {
      const e = entityBinding[i];
      const cTemplates = this.componentTemplates[i];
      for (let j = 0; j < cTemplates.length; ++j) {
        if (!cTemplates[j].checkValid(e, eMgr)) return false;
      }
    }

    // Check relationships
    for (let i = 0; i < entityBinding.length; ++i) {
      if (!checkEntityRelationshipsAndComponentComparisonTemplates(
        entityBinding,
        entityBinding[0],
        eMgr,
        this.entityRelationships[i],
        this.entityRelsByChildIdx[i],
        this.componentComparisons[i],
        this.componentCompsByChildIdx[i],
      )) {
        return false;
      }
    }

    return true;
  }

  /// Returns a list of all the valid entity bindings for this condition set.
  /// By default, self may not be one of the targets except for entity[0].
  public bindEntities(eMgr: EntityManager, self = -1, canTargetSelf = false): number[][] {
    const candidateEntities: number[][] = [];

    let firstEntityToBind = 0;
    if (self > 0) {
      candidateEntities.push([self]);
      firstEntityToBind = 1;
    } else {
      // Not supplying SELF to an entityTemplate would currently
      // result in every entity being considered
      const error = 'Warning: not supplying '
      + 'self to entityTemplate in an action is not yet supported.';
      throw new Error(error);
    }

    // Start with all possible matching entities for each entityTemplate
    for (let i = firstEntityToBind; i < this.entityTemplates.length; ++i) {
      candidateEntities.push(this.entityTemplates[i].findCandidateEntities(eMgr));
    }

    checkMaxPermutations(candidateEntities);

    // Remove self except for self-targeted actions
    if (!canTargetSelf) {
      for (
        let entityVarIdx = firstEntityToBind;
        entityVarIdx < candidateEntities.length;
        ++entityVarIdx
      ) {
        const candidates = candidateEntities[entityVarIdx];
        for (let candidateIdx = 0; candidateIdx < candidates.length; ++candidateIdx) {
          const entity = candidates[candidateIdx];
          if (entity === self) {
            swapRemoveAt(candidates, candidateIdx);
            // This can only happen once per entity variable as there's only one SELF
            break;
          }
        }
      }
    }

    // Check individual component value conditions
    const candidatesToDelete: number[][] = [];
    for (let i = 0; i < candidateEntities.length; ++i) {
      candidatesToDelete.push([]);
    }

    for (
      let entityVarIdx = firstEntityToBind;
      entityVarIdx < this.componentTemplates.length;
      ++entityVarIdx
    ) {
      const cTemplateList = this.componentTemplates[entityVarIdx];
      const candidates = candidateEntities[entityVarIdx];

      for (
        let candidateIdx = 0;
        candidateIdx < candidateEntities[entityVarIdx].length;
        ++candidateIdx
      ) {
        const entity = candidates[candidateIdx];

        for (let cTemplateIdx = 0; cTemplateIdx < cTemplateList.length; ++cTemplateIdx) {
          const cTemplate = cTemplateList[cTemplateIdx];

          if (!cTemplate.checkValid(entity, eMgr)) {
            candidatesToDelete[entityVarIdx].push(candidateIdx);
            break;
          }
        }
      }
    }

    deleteCandidateEntities(candidateEntities, candidatesToDelete);

    // Check entity and component relationships and begin binding list
    // OPTIMIZE: if available, use the smallest entity relationships to
    //           initialize the bindings lists
    // TODO: if there is only a single entity to bind, use a shorter method
    // that doesn't check inter-entity relationships
    const finalBindings = this.finalizeBindings(
      0,
      [],
      candidateEntities,
      eMgr,
    );
    return finalBindings;
  }

  /// Finds permutations of entities that match entity/component relationship conditions
  /// by recursively nesting for loops. Since this is expensive, should always go last
  /// after candidate bindings have already been winnowed down.
  ///
  /// depth = entityTemplate index
  /// curBinding = entities bound so far. Should have length of depth
  private finalizeBindings(
    depth: number,
    curBinding: number[],
    candidateEntities: number[][],
    eMgr: EntityManager,
  ): number[][] {
    const bindings: number[][] = [];
    const candidates = candidateEntities[depth];
    const binding: number[] = [...curBinding, -1];

    if (depth < candidateEntities.length - 1) {
      // Not in the inner loop, recursively aggregate the next depth layer
      for (let i = 0; i < candidates.length; ++i) {
        const curEntity = candidates[i];
        // Need to add SELF to binding before EntityRel check in case of self-relationships
        binding[depth] = curEntity;

        if (checkEntityRelationshipsAndComponentComparisonTemplates(
          binding,
          curEntity,
          eMgr,
          this.entityRelationships[depth],
          this.entityRelsByChildIdx[depth],
          this.componentComparisons[depth],
          this.componentCompsByChildIdx[depth],
        )) {
          const nextBinding = [...binding];
          bindings.push(...this.finalizeBindings(depth + 1, nextBinding, candidateEntities, eMgr));
        }
      }

      return bindings;
    }

    // Inner for-loop
    for (let i = 0; i < candidates.length; ++i) {
      const cur = candidates[i];

      // Need to add "cur" to binding before EntityRel check in case of self-relationships
      binding[depth] = cur;
      if (checkEntityRelationshipsAndComponentComparisonTemplates(
        binding,
        cur,
        eMgr,
        this.entityRelationships[depth],
        this.entityRelsByChildIdx[depth],
        this.componentComparisons[depth],
        this.componentCompsByChildIdx[depth],
      )) {
        const validBinding = [...binding];
        bindings.push(validBinding);
      }
    }
    return bindings;
  }
}

// Estimate the number of binding attempts
// A very large number of possible binding permutations likely
// indicates a need for smaller, more specific components. Consider
// adding additional component flags, adding component restraints to
// condition sets, or converting relationships/predicates to components.
export function checkMaxPermutations(
  candidateEntities: number[][],
  MAX_BINDING_PERMUTATIONS = 10000,
): void {
  let numPermutations = 1;
  for (let i = 0; i < candidateEntities.length; ++i) {
    numPermutations *= candidateEntities[i].length;
  }
  if (numPermutations > MAX_BINDING_PERMUTATIONS) {
    throw new Error(`${'Not supported: Warning: likely error in'
        + 'entityTemplate specification, possible permutations exceeds max. '
        + 'Permutations: '}${numPermutations}`);
  }
}

/// Helper function that deletes items in the candidateEntities list
/// based on the candidatesToDelete.
/// Delayed deletion for speed reasons.
///
/// each list candidatesToDelete[i] should be an ordered subset of candidateEntities[i]
export function deleteCandidateEntities(
  candidateEntities: number[][],
  candidatesToDelete: number[][],
): void {
  for (let entityVarIdx = 0; entityVarIdx < candidatesToDelete.length; ++entityVarIdx) {
    const toDelete = candidatesToDelete[entityVarIdx];
    const candidates = candidateEntities[entityVarIdx];

    // Because SwapRemove reorders items, entities must be removed from back to front of list!
    for (let toDeleteIdx = toDelete.length - 1; toDeleteIdx >= 0; --toDeleteIdx) {
      // In Unity, it was the following line but this seems like a bug
      // swapRemoveAt(toDelete, candidateIdx);
      // In addition, the for loop variables were different

      // I think it should be
      const candidateIdx = toDelete[toDeleteIdx];
      swapRemoveAt(candidates, candidateIdx);
    }
    toDelete.splice(0, toDelete.length);
  }
}

export function checkEntityRelationshipsAndComponentComparisonTemplates(
  entityBinding: number[], // A valid entityBinding subset so far
  entityCandidate: number, // The entity tentatively being appended to the entityBinding
  eMgr: EntityManager,

  // All of the following are templates between the candidate entity
  // and an entity that has already been added to the entityBinding
  // that must match in order for the candidate entity to be valid
  entityRels: [number, EntityRelationshipTemplateBase][],
  entityRelsByChildIdx: [number, EntityRelationshipTemplateBase][],
  componentComparisons: [number, ComponentComparisonTemplateBase][],
  componentComparisonsByChildIdx: [number, ComponentComparisonTemplateBase][],
): boolean {
  // Check entity relationships between parent = THIS entityVar and child = PREVIOUS entityVars
  for (let relIdx = 0; relIdx < entityRels.length; ++relIdx) {
    const [childIdx, rel] = entityRels[relIdx];

    if (childIdx > entityBinding.length) {
      const msg = 'childIdx out of range. '
      + 'Relationships should only be placed in the list of the greater var idx';
      throw new Error(msg);
    }

    const child = entityBinding[childIdx];
    const children = rel.getChildren(entityCandidate, eMgr);
    if (!children.includes(child)) {
      return false;
    }
  }

  // Check entity relationships between parent = PREVIOUS entityVars and child = THIS entityVar
  for (let relIdx = 0; relIdx < entityRelsByChildIdx.length; ++relIdx) {
    const [parentIdx, rel] = entityRelsByChildIdx[relIdx];

    if (parentIdx > entityBinding.length) {
      const msg = 'parentIdx out of range. '
      + 'Relationships should only be placed in the list of the greater var idx';
      throw new Error(msg);
    }

    const parent = entityBinding[parentIdx];
    const children = rel.getChildren(parent, eMgr);
    if (!children.includes(entityCandidate)) {
      return false;
    }
  }

  // Check component comparisons between parent = THIS entityVar and child = PREVIOUS entityVars
  for (let relIdx = 0; relIdx < componentComparisons.length; +relIdx) {
    const [childIdx, rel] = componentComparisons[relIdx];

    const child = entityBinding[childIdx];
    if (!rel.checkValid(entityCandidate, child, eMgr)) {
      return false;
    }
  }

  // Check component comparisons between parent = PREVIOUS entityVars and child = THIS entityVar
  for (let relIdx = 0; relIdx < componentComparisonsByChildIdx.length; ++relIdx) {
    const [parentIdx, rel] = componentComparisonsByChildIdx[relIdx];

    const parent = entityBinding[parentIdx];
    if (!rel.checkValid(parent, entityCandidate, eMgr)) {
      return false;
    }
  }

  return true;
}
