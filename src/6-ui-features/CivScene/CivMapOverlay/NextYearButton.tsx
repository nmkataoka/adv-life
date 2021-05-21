import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem';
import { useDispatch } from '4-react-ecsal';
import { updateTowns } from '1-game-code/World/Civs/CivSys';

export function NextYearButton(): JSX.Element {
  const dispatch = useDispatch();
  return <Button onClick={() => dispatch(updateTowns())}>Next Year</Button>;
}

const Button = styled(PrimaryButton)`
  position: absolute;
  bottom: 1em;
  right: 1em;
`;
