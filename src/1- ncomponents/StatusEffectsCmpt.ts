import { NComponent } from "../0-engine/ECS/NComponent";

export class StatusEffectsCmpt implements NComponent {
  public isChanneling() {
    return this.channelRemaining > 0;
  }

  public startChanneling(channelDuration: number) {
    this.channelRemaining = channelDuration;
  }

  public cancelChannel() {
    this.channelRemaining = 0;
  }

  public channelRemaining = 0;
}