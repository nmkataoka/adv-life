import { MeshProps } from '9-three-helpers';
import React, { useState } from 'react';
import { MouseEvent } from 'react-three-fiber';
import { Vector3 } from 'three';

const X = (props: MeshProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <mesh {...props}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default function Ground(props: MeshProps): JSX.Element {
  const [xposition, setXposition] = useState<null | Vector3>(null);

  const handleClick = (e: MouseEvent) => {
    const pos = e.intersections[0]?.point;
    pos.setZ(0);
    setXposition(pos);
  };

  return (
    <>
      {xposition != null && <X position={xposition} />}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <mesh {...props} onClick={handleClick}>
        <planeBufferGeometry args={[100, 50, 1, 1]} />
      </mesh>
    </>
  );
}
