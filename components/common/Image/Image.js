import NextImage from 'next/image';

export function Image({ alt, src, className }) {
  const imgSrc = typeof src === 'string' ? src : src.src;
  return (
    <NextImage
      className={className}
      alt={alt}
      src={imgSrc}
      width={800}
      height={400}
      priority={true}
      unoptimized={true}
    />
  );
}
