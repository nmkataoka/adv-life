import { EntityManager } from './ECS/EntityManager'
import { HealthCmpt } from '../ncomponents/HealthCmpt';
import { CanAttackCmpt } from '../ncomponents/CanAttackCmpt';
import { WeaponCmpt } from '../ncomponents/WeaponCmpt';
import { FactionCmpt } from '../ncomponents/FactionCmpt';

export class GameManager {
  public static readonly instance = new GameManager();

  public eMgr: EntityManager;

  constructor() {
    this.eMgr = new EntityManager();
    for(let i = 0; i < 3; ++i) {
      this.CreateUnit();
    }
    for(let i = 0; i < 3; ++i) {
      this.CreateUnit(true);
    }
  }

  public Start(): void {
    this.eMgr.CreateEntity();
  }

  private CreateUnit(isEnemy = false): void {
    const e = this.eMgr.CreateEntity();
    this.eMgr.AddComponent(e, new HealthCmpt());
    this.eMgr.AddComponent(e, new CanAttackCmpt());
    this.eMgr.AddComponent(e, new WeaponCmpt());
    const faction = new FactionCmpt();
    faction.isEnemy = isEnemy;
    this.eMgr.AddComponent(e, faction);
  }
}