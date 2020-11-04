import React from 'react';
import { Canvas } from 'react-three-fiber';
import Ground from './Ground';
import Unit from './Unit';

export default function ColosseumScene(): JSX.Element {
  return (
    <Canvas>
      <Ground position={[0, 0, -1]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Unit position={[-1.2, 0, 0]} />
      <Unit position={[1.2, 0, 0]} color="red" />
      <Unit position={[4.2, 0, 0]} color="red" />
    </Canvas>
  );
}
