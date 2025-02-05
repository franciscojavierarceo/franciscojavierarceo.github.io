export default function imageLoader({ src }) {
  if (src.startsWith('/')) {
    return src;
  }
  return `/assets/${src}`;
}
