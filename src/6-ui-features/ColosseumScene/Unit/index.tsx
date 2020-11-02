import { MeshProps } from '9-three-helpers';
import React, { useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { Mesh } from 'three';

export default function Unit(props: MeshProps): JSX.Element {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    const currentMesh = mesh.current;
    if (currentMesh != null) {
      currentMesh.rotation.y += 0.01;
      currentMesh.rotation.x += 0.01;
    }
  });

  return (
    <mesh
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
