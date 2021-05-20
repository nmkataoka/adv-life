import { VillageIcon } from '6-ui-features/DesignSystem/icons';
import { getColor } from '6-ui-features/Theme';
import styled from '@emotion/styled';

interface TownProps {
  name: string;
  coords: [number, number];
}

export function Town({ name, coords }: TownProps): JSX.Element {
  const [x, y] = coords;
  return (
    <TownContainer style={{ left: x, top: y }}>
      <Icon height={24} width={24} />
      {name}
    </TownContainer>
  );
}

const Icon = styled(VillageIcon)`
  transform: translate(0, 65%);
`;

const TownContainer = styled.div`
  position: absolute;
  color: ${getColor('white')};
  display: flex;
  align-items: center;
  text-shadow: 0px 0px 3px ${getColor('black')};
`;
