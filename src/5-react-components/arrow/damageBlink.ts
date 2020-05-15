import { css, keyframes } from "@emotion/core";

const blink = keyframes`
  0% { background-color: red }
  50% { background-color: white }
`;

export const damageBlinkCss = css`
  animation: ${blink} 0.2s step-start infinite;
`;
