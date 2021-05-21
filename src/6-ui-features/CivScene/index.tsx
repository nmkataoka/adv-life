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
      <Page>
        <TopBar />
        <Content>Player does not own a civ.</Content>
      </Page>
    );
  }

  // hello
  return (
    <Page>
      <TopBar />
      <Content>
        <Map />
      </Content>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: stretch;
`;

const Content = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  grid-template-areas: 'map';
`;
