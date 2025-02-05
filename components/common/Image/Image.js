import Image from 'next/image';

export function CustomImage({ alt, src, className }) {
  return (
    <Image
      className={className}
      alt={alt}
      src={src}
      width={800}
      height={400}
      priority={true}
      unoptimized={true}
    />
  );
}
