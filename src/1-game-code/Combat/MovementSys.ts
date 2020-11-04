import { ECSystem } from '0-engine';
import { CombatPositionCmpt } from './CombatPositionCmpt';
import { MovementCmpt } from './MovementCmpt';

export class MovementSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(dt: number): void {
    this.moveUnits(dt);
  }

  private moveUnits(dt: number) {
    const view = this.eMgr.getView<[], [MovementCmpt, CombatPositionCmpt]>(
      [],
      [MovementCmpt, CombatPositionCmpt],
    );
    view.forEach((e: number, _, [movementCmpt, combatPosCmpt]) => {
      const { speed, destination } = movementCmpt;
      const { pos } = combatPosCmpt;
      const dir = destination.subtract(pos);
      const movement = dir.multiply(speed * dt);
      combatPosCmpt.pos.addMut(movement);
    });
  }
}
