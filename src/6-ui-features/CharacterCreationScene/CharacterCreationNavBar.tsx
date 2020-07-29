import React from 'react';
import styled from '@emotion/styled';

const navItems = [
  'Race',
  'Class',
  'Attributes',
  'Culture',
  'Appearance',
  'Voice',
];

export default function CharacterCreationNavBar(): JSX.Element {
  return <Container>{navItems.map((item) => <NavItem key={item}>{item}</NavItem>)}</Container>;
}

const Container = styled.div`
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: lightblue;
`;

const NavItem = styled.button`
  background-color: green;
`;
