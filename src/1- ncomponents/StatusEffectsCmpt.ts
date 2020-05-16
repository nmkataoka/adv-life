import { NComponent } from '../0-engine/ECS/NComponent';

export class StatusEffectsCmpt implements NComponent {
  public channelRemaining = 0;

  public channelTotalDuration = 0;

  public recoveryRemaining = 0;

  public recoveryTotalDuration = 0;

  public isChanneling() {
    return this.channelRemaining > 0;
  }

  public startChanneling(channelDuration: number) {
    this.channelRemaining = channelDuration;
    this.channelTotalDuration = channelDuration;
  }

  public cancelChannel() {
    this.channelRemaining = 0;
  }

  public isRecovering() {
    return this.recoveryRemaining > 0;
  }

  public startRecovering(recoveryDuration: number) {
    this.recoveryRemaining = recoveryDuration;
    this.recoveryTotalDuration = recoveryDuration;
  }
}
