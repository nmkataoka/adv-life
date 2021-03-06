import { setPlayerDestination } from '2-backend-api/PlayerMovement/setPlayerDestination';
import apiClient from '3-frontend-api/ApiClient';
import { useSelector2 } from '4-react-ecsal';
import { Vector2 } from '8-helpers/math';
import { MeshProps } from '9-three-helpers';
import React, { useState } from 'react';
import { MouseEvent } from 'react-three-fiber';
import { Vector3 } from 'three';
import { getPlayerId } from '3-frontend-api';

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
  const playerId = useSelector2(getPlayerId) ?? -1;
  const [xposition, setXposition] = useState<null | Vector3>(null);

  const handleClick = (e: MouseEvent) => {
    const pos = e.intersections[0]?.point;
    pos.setZ(0);
    setXposition(pos);
    const destination: Vector2 = new Vector2(pos.x, pos.y);
    void apiClient.emit(setPlayerDestination({ destination, userId: playerId }));
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
