import { NULL_ENTITY } from '0-engine';
import { getPlayerCiv } from '3-frontend-api';
import { useSelector2 } from '4-react-ecsal';
import TopBar from '6-ui-features/TopBar';
import styled from '@emotion/styled';
import { Map } from './Map';

export default function CivScene(): JSX.Element {
  const playerCivId = useSelector2(getPlayerCiv);

  if (playerCivId === NULL_ENTITY) {
    return (
      <>
        <TopBar />
        <Page>Player does not own a civ.</Page>
      </>
    );
  }

  // hello
  return (
    <>
      <TopBar />
      <Page>
        <Map />
      </Page>
    </>
  );
}

const Page = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  grid-template-areas: 'map';
`;
