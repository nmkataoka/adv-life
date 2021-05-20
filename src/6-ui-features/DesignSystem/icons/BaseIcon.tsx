import styled from '@emotion/styled';
import { ReactNode } from 'react';

export interface BaseIconProps {
  children?: ReactNode;
  /** Height of the icon in px */
  height?: number;
  /** Width of the icon in px */
  width?: number;
}

export function BaseIcon({ children, height = 16, width = 16 }: BaseIconProps): JSX.Element {
  return (
    <Svg style={{ height: `${height}px`, width: `${width}px` }} viewBox={`0 0 ${width} ${height}`}>
      {children}
    </Svg>
  );
}

export const Svg = styled.svg`
  path: {
    fill: currentColor;
  }
`;
