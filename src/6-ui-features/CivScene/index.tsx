import styled from '@emotion/styled';
import { Map } from './Map';

export default function CivScene(): JSX.Element {
  // hello
  return (
    <Page>
      <Map />
    </Page>
  );
}

const Page = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  grid-template-areas: 'map';
`;
