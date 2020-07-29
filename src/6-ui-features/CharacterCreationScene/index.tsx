import React from 'react';
import styled from '@emotion/styled';
import CharacterCreationNavBar from './CharacterCreationNavBar';

export default function CharacterCreationScene(): JSX.Element {
  return (
    <Container>
      <CharacterCreationNavBar />
      Character Creation
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;
