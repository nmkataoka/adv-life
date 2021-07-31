import { createTown } from '1-game-code/Town/TownSys';
import { DefaultState, ExecutorStatus, ProcRule, RequiredProps, TickReturn } from '../ProcRule';

interface CreateTownProps extends RequiredProps {
  coords?: [number, number];
}

function chooseTownLocation(): [number, number] {}

export class CreateTown extends ProcRule {
  public tick(props: CreateTownProps, state: DefaultState): TickReturn {
    const { dispatch, entityBinding } = props;
    let { coords } = props;
    const [civilizationId] = entityBinding;

    if (!coords) coords = chooseTownLocation();

    // In the future, instead of voiding this, we should probably check if the promise is
    // resolved. If no -> Status.Running, if yes -> Success or Failure
    void dispatch(createTown({ civilizationId, coords, name: 'Town' }));
    return { status: ExecutorStatus.Success, state };
  }
}
