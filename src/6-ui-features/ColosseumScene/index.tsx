import React from 'react';
import { Canvas } from 'react-three-fiber';
import Unit from './Unit';

export default function ColosseumScene(): JSX.Element {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Unit position={[-1.2, 0, 0]} />
      <Unit position={[1.2, 0, 0]} />
    </Canvas>
  );
}
