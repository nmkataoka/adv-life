import { RingQueue } from '8-helpers/containers/RingQueue';
import { DataLayer } from './DataLayer';

export function boxBlur(dataLayer: DataLayer, pixels: number): void {
  // Box blur is amazing because horizontal and vertical blurring can be
  // conducted independently.

  const { width, height, isCylindrical } = dataLayer;
  if (!isCylindrical) {
    throw new Error('Non-cylindrical behavior not implemented');
  }

  // Horizontal blur
  for (let yi = 0; yi < height; ++yi) {
    let dataSum = 0;
    const dataQueue = new RingQueue<number>();
    for (let start = 0; start < 2 * pixels; ++start) {
      const datum = dataLayer.at(start, yi);
      dataSum += datum;
      dataQueue.push(datum);
    }
    for (let xi = pixels; xi < width + pixels; ++xi) {
      const datum = dataLayer.at(xi + pixels, yi);
      dataSum += datum;
      dataQueue.push(datum);

      dataLayer.set(xi, yi, dataSum / (2 * pixels + 1));
      dataSum -= dataQueue.pop();
    }
  }

  // Vertical blur
  for (let xi = 0; xi < width; ++xi) {
    let dataSum = 0;
    const dataQueue = new RingQueue<number>();
    for (let start = 0; start < 2 * pixels; ++start) {
      const datum = dataLayer.at(xi, start);
      dataSum += datum;
      dataQueue.push(datum);
    }
    for (let yi = pixels; yi < height - pixels; ++yi) {
      const datum = dataLayer.at(xi, yi + pixels);
      dataSum += datum;
      dataQueue.push(datum);

      dataLayer.set(xi, yi, dataSum / (2 * pixels + 1));
      dataSum -= dataQueue.pop();
    }
  }
}
