import '@emotion/react';

export const defaultTheme = {
  colors: {
    asuna: '#E8B695',
    asunaDarker: '#E0A97A',
    white: '#F7F1F5',
    blueSky: '#BBE3EF',
    blueLighter: '#96C2DF',
    blue: '#237CB6',
    blueDarker: '#1B4C8F',
    grayLighter: '#9F999D',
    gray: '#6D7079',
    grayDarker: '#2B3D51',
    black: '#0C131D',
  },
};

type MyTheme = typeof defaultTheme;

export const getColor =
  (colorName: keyof typeof defaultTheme['colors']) =>
  ({ theme }: { theme: MyTheme }): string => {
    return theme.colors[colorName];
  };

declare module '@emotion/react' {
  export interface Theme {
    colors: MyTheme['colors'];
  }
}
