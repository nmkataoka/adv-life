import { NComponent } from '../0-engine/ECS/NComponent';
import { BoundAction } from '../2-ecsystems/Agent/BoundAction';

export class AgentCmpt implements NComponent {
  public baction?: BoundAction;
}
