import styled from '@emotion/styled';
import { useSelector2 } from '4-react-ecsal';
import { Canvas } from 'react-three-fiber';
import { getPlayerId, getUnitPosition } from '3-frontend-api';
import TopBar from '6-ui-features/TopBar';
import Ground from './Ground';
import Unit from './Unit';
import ActionBar from './ActionBar';

export default function ColosseumScene(): JSX.Element {
  const playerId = useSelector2(getPlayerId) ?? -1;
  const playerPos = useSelector2(getUnitPosition(playerId)) ?? { x: 0, y: 0 };
  const { x, y } = playerPos;
  const playerPosition: [number, number, number] = [x, y, 0];

  return (
    <>
      <TopBar />
      <Container>
        <Canvas>
          <Ground position={[0, 0, -1]} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Unit position={playerPosition} />
          <Unit position={[1.2, 0, 0]} color="red" />
          <Unit position={[4.2, 0, 0]} color="red" />
        </Canvas>
        <ActionBar />
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 800px;
  width: 100%;
  position: relative;
`;
