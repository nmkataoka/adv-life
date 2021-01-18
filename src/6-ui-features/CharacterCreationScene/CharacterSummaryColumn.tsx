import styled from '@emotion/styled';
import { useDispatch } from '4-react-ecsal';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { useIsTest } from '6-ui-features/TestContext';
import { createWorld } from '6-ui-features/WorldGenScene/Sidebar/createWorld';
import { WorldGenModules, WorldGenModulesTest } from '6-ui-features/WorldGenScene/constants';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll, finishCharacterCreation } from './characterCreationSlice';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const reduxDispatch = useReduxDispatch();
  const dispatch = useDispatch();
  const isTest = useIsTest();

  const handleRandomizeAllClick = () => {
    reduxDispatch(randomizeAll());
  };

  const handleFinish = async () => {
    if (isTest) {
      await dispatch(createWorld('a wonderful life', WorldGenModulesTest));
    } else {
      await dispatch(createWorld('a wonderful life', WorldGenModules));
    }
    reduxDispatch(finishCharacterCreation());
    reduxDispatch(changedScene(Scene.Town));
  };

  return (
    <Container>
      <RandomizeButton onClick={handleRandomizeAllClick}>Randomize All</RandomizeButton>
      <CharacterSummary />
      <FinishButton onClick={handleFinish}>Done</FinishButton>
    </Container>
  );
};

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 0 1em;
`;

const RandomizeButton = styled.button`
  padding: 1em;
`;

const FinishButton = styled.button`
  padding: 1em 3em;
`;

export default CharacterSummaryColumn;
