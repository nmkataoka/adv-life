import { EntityManager } from '0-engine';
import { CombatStatsCmpt } from '1-game-code/Combat/CombatStatsCmpt';

type SkillData = {
  data: any;
  recoveryDuration: number;
};

export function getSkillData(user: number, targets: number[], skillName: string): SkillData {
  let data: any;
  const recoveryDuration = getRecoveryDuration(user);

  switch (skillName) {
    case 'attack': {
      data = 15;
      break;
    }
    case 'fireball': {
      break;
    }
    case 'recover': {
      data = recoveryDuration;
      break;
    }
    case 'stealth': {
      data = 3; // stealth duration
      break;
    }
    case 'heal': {
      data = 40;
      break;
    }
    default:
      break;
  }

  return { data, recoveryDuration };
}

function getRecoveryDuration(user: number) {
  const defaultRecoveryPeriod = 2;
  const combatStatsCmpt = EntityManager.instance.tryGetCmptMut(CombatStatsCmpt, user);
  const recoveryDuration = combatStatsCmpt?.getAttackCooldown() ?? defaultRecoveryPeriod;
  return recoveryDuration;
}
