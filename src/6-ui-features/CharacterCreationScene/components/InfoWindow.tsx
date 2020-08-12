import React from 'react';
import { useSelector } from 'react-redux';
import Window from './Window';
import { RootState } from '../../../7-app/types';

export default function InfoWindow(): JSX.Element {
  const title = useSelector((state: RootState) => state.characterCreation.infoWindowTitle);
  const text = useSelector((state: RootState) => state.characterCreation.infoWindowText);
  return (
    <Window header={title || 'Information'}>
      {text || 'Click on an option to learn more.'}
    </Window>
  );
}
