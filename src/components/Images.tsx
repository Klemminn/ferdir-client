import React from 'react';
import { LazyImage } from 'react-lazy-images';

type ImageProps = {
  src: string;
};

export const HotelImage: React.FC<ImageProps> = ({ src }) => (
  <LazyImage
    placeholder={({ ref }) => <div ref={ref} />}
    src={src}
    actual={({ imageProps }) => (
      <img height="100%" width="100%" alt="" {...imageProps} />
    )}
  />
);

export const AgencyLogo: React.FC<ImageProps> = ({ src }) => (
  <LazyImage
    placeholder={({ ref }) => <div ref={ref} />}
    src={src}
    actual={({ imageProps }) => <img height="100%" alt="" {...imageProps} />}
  />
);
