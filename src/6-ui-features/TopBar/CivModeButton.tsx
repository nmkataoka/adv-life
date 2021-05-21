import { useReduxDispatch } from '11-redux-wrapper';
import { changedScene } from '6-ui-features/sceneManager/sceneMetaSlice';
import { getColor } from '6-ui-features/Theme';
import styled from '@emotion/styled';

export function CivModeButton(): JSX.Element {
  const reduxDispatch = useReduxDispatch();
  return <Button onClick={() => reduxDispatch(changedScene('civ'))}>Civ</Button>;
}

const Button = styled.button`
  background-color: ${getColor('asuna')};
  color: ${getColor('black')};
  margin-right: 1em;
`;
