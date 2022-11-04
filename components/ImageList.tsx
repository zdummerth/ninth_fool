import Image from 'next/image';
interface Props {
  images: any;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function ImageList({ images }: Props) {
  return (
    <div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 w-full">
        {images
          .filter((img: any) => img.name !== '.emptyFolderPlaceholder')
          .map((img: any) => {
            return (
              <div
                className="relative w-full mb-4 rounded-xl overflow-hidden"
                key={img.signedUrl}
              >
                <Image
                  src={img.signedUrl}
                  layout="responsive"
                  width={img.width}
                  height={img.height}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(img.width, img.height)
                  )}`}
                  key={img.id ? img.id : img.url}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
