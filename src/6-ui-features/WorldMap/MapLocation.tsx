import styled from '@emotion/styled';

type MapLocationProps = {
  name: string;
  onClick?: () => void;
};

export default function MapLocation({ name, onClick }: MapLocationProps): JSX.Element {
  return <Button onClick={onClick}>{name}</Button>;
}

const Button = styled.button`
  border-radius: 50%;
  background-color: lightblue;
  padding: 1em;
`;
