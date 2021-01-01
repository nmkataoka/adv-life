import React from 'react';

type ImageProps = {
  alt: string;
  className?: string;
  src: string;
};

export function Image({ alt, className, src }: ImageProps): JSX.Element {
  return (
    <img alt={alt} className={className} src={`https://adv-life-images.leatherbee.org${src}`} />
  );
}
