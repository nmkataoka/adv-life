import styled from '@emotion/styled';
import { useReduxSelector } from '11-redux-wrapper';
import { RootState } from '7-app/types';
import { getColor } from '6-ui-features/Theme';
import WorldMapButton from './WorldMapButton';
import { CivModeButton } from './CivModeButton';

const actions = ['Menu'];

export default function TopBar(): JSX.Element {
  const title = useReduxSelector((state: RootState) => state.topBar.title);
  return (
    <Container>
      <LeftGroup>
        {actions.map((a) => (
          <ActionButton key={a}>{a}</ActionButton>
        ))}
      </LeftGroup>
      <CenterGroup>{title && <Title>{title}</Title>}</CenterGroup>
      <RightGroup>
        <CivModeButton />
        <WorldMapButton />
      </RightGroup>
    </Container>
  );
}

const Container = styled.div`
  color: ${getColor('asuna')};
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5em 1em;
  background-color: ${getColor('black')};
  box-sizing: border-box;
  flex: 0 0 auto;
`;

const Title = styled.h2`
  font-family: var(--header-font-family);
`;

const ActionButton = styled.div`
  background-color: ${getColor('asuna')};
  color: ${getColor('black')};
  margin-right: 0.5em;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1 1 0;
`;

const CenterGroup = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 1 0;
`;

const RightGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1 1 0;
`;
