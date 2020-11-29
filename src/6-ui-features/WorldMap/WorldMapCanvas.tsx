import React, { useCallback, useEffect, useRef } from 'react';

export default function WorldMapCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback((renderer: ImageBitmap) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const cW = canvas.width;
      const cH = canvas.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(renderer, 0, 0, cW, cH);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgW = 20;
    const imgH = 20;

    // generate a 20*20 ImageData full of noise
    const data = new Uint8Array(imgW * imgH * 4);
    crypto.getRandomValues(data);
    const img = new ImageData(new Uint8ClampedArray(data.buffer), imgW, imgH);

    void createImageBitmap(img).then(drawImage);
  }, [drawImage]);

  return <canvas ref={canvasRef} height={300} width={300} />;
}
