import styled from '@emotion/styled';
import { ReactNode, SVGProps } from 'react';

export interface BaseIconProps extends SVGProps<SVGSVGElement> {
  children?: ReactNode;
  /** Height of the icon in px */
  height?: number;
  /** Width of the icon in px */
  width?: number;

  viewBox?: string;
}

export function BaseIcon({
  children,
  height = 16,
  viewBox,
  width = 16,
  ...props
}: BaseIconProps): JSX.Element {
  return (
    <Svg
      {...props}
      style={{ height: `${height}px`, width: `${width}px` }}
      viewBox={viewBox ?? `0 0 ${width} ${height}`}
    >
      {children}
    </Svg>
  );
}

export const Svg = styled.svg`
  path {
    fill: currentColor;
  }
`;
