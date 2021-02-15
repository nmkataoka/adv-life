import { useReduxSelector } from '11-redux-wrapper';
import { RootState } from '7-app/types';
import Window from './Window';

export default function InfoWindow(): JSX.Element {
  const title = useReduxSelector((state: RootState) => state.characterCreation.infoWindowTitle);
  const text = useReduxSelector((state: RootState) => state.characterCreation.infoWindowText);
  return (
    <Window header={title || 'Information'}>{text || 'Click on an option to learn more.'}</Window>
  );
}
