import React from 'react';
import styled from '@emotion/styled';
import PartyMember from './PartyMember';

const PartySummary = (): JSX.Element => (
  <Container>
    <PartyMember />
  </Container>
);

export default PartySummary;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
