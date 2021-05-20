import { VillageIcon } from '6-ui-features/DesignSystem/icons';
import styled from '@emotion/styled';

interface TownProps {
  name: string;
  coords: [number, number];
}

export function Town({ name, coords }: TownProps): JSX.Element {
  const [x, y] = coords;
  return (
    <TownContainer style={{ left: x, top: y }}>
      <VillageIcon />
      {name}
    </TownContainer>
  );
}

const TownContainer = styled.div`
  position: absolute;
`;
