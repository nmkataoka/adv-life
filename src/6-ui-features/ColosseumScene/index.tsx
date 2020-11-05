import { RootState } from '7-app/types';
import React from 'react';
import { useSelector as useReduxSelector } from 'react-redux';
import { useSelector } from '4-react-ecsal';
import { Canvas } from 'react-three-fiber';
import { getUnitPosition } from '3-frontend-api';
import Ground from './Ground';
import Unit from './Unit';

export default function ColosseumScene(): JSX.Element {
  const playerId = useReduxSelector((state: RootState) => state.player.playerId);
  const playerPos = useSelector(getUnitPosition(playerId));

  const playerPosition: [number, number, number] = [playerPos.x, playerPos.y, 0];

  return (
    <Canvas>
      <Ground position={[0, 0, -1]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Unit position={playerPosition} />
      <Unit position={[1.2, 0, 0]} color="red" />
      <Unit position={[4.2, 0, 0]} color="red" />
    </Canvas>
  );
}
