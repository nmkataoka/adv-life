import { MeshProps } from '9-three-helpers';
import React, { useRef, useState } from 'react';
import { Mesh } from 'three';

type UnitProps = MeshProps & {
  color?: string;
};

export default function Unit(props: UnitProps): JSX.Element {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();
  const { color = 'orange', ...meshProps } = props;

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(!active);
  };

  return (
    <mesh
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...meshProps}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={handleClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <circleBufferGeometry args={[1, 32]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
    </mesh>
  );
}
