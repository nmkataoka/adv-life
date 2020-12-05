import { EventSys } from './ECS/event-system/EventSys';
import { ECSystemConstructor } from './ECS/ecsystem';

const SystemList: ECSystemConstructor<any>[] = [
  // Core systems
  EventSys,
];

export default SystemList;
