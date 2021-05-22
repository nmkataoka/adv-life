import { Info, useInfoBox } from '6-ui-features/Info';
import { getColor } from '6-ui-features/Theme';
import styled from '@emotion/styled';
import { VillageMapSymbolIcon } from '../icons';

interface TownProps {
  name: string;
  coords: [number, number];
}

export function Town({ name, coords }: TownProps): JSX.Element {
  const [x, y] = coords;
  const { isInfoBoxMine, requestInfoBoxOwnership } = useInfoBox();
  return (
    <TownContainer style={{ left: x, top: y }} onClick={requestInfoBoxOwnership}>
      <Icon height={24} width={24} />
      {name}
      {isInfoBoxMine && (
        <Info>
          <h2>{name}</h2>
          This town is a really great town.
        </Info>
      )}
    </TownContainer>
  );
}

const Icon = styled(VillageMapSymbolIcon)`
  transform: translate(0, 65%);
`;

const TownContainer = styled.div`
  position: absolute;
  color: ${getColor('white')};
  display: flex;
  align-items: center;
  text-shadow: 0px 0px 3px ${getColor('black')};

  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-shadow: 0 0 6px ${getColor('black')}, 0 0 6px ${getColor('black')};
  }
`;
