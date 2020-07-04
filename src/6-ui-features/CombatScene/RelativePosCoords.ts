export type Coords = {
  x: number;
  y: number;
}

export function getCoordsFromElement(el: HTMLDivElement): Coords {
  const {
    offsetLeft, offsetTop, clientWidth, clientHeight,
  } = el;
  return { x: offsetLeft + clientWidth / 2, y: offsetTop + clientHeight / 2 };
}
