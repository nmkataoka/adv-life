import WorldMapCanvas from '6-ui-features/WorldMap/WorldMapCanvas';
import React from 'react';

export default function WorldGenScene(): JSX.Element {
  return (
    <div>
      <h2>World Gen</h2>
      <div>
        <WorldMapCanvas height={300} width={400} />
      </div>
    </div>
  );
}
