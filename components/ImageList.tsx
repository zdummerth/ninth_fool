import Image from 'next/image';
import { useState } from 'react';
interface Props {
  images: any;
  setImage?: any;
}
import MasonryLayout from './Masonry';

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

export default function ImageList({ images, setImage }: Props) {
  const [enlargerImg, setEnlargedImg] = useState<any>(null);
  const handleImgChange = (action = 'next') => {
    const currentIndex = images.findIndex(
      (img: any) => img.signedUrl === enlargerImg.signedUrl
    );
    let ind = 0;
    switch (currentIndex) {
      case 0:
        ind = action === 'next' ? 1 : images.length - 1;
        break;
      case images.length - 1:
        ind = action === 'next' ? 0 : images.length - 2;
        break;

      default:
        ind = action === 'next' ? currentIndex + 1 : currentIndex - 1;
        break;
    }
    setEnlargedImg(images[ind]);
  };
  return (
    <div>
      {enlargerImg && (
        <div className="fixed w-screen h-screen left-0 top-0 z-50 bg-black">
          <div className="absolute bottom-10 z-20 flex justify-center w-full bg-black/50">
            <button className="mx-2" onClick={() => handleImgChange('prev')}>
              Prev
            </button>
            <button className="mx-2" onClick={() => setEnlargedImg(null)}>
              Close
            </button>
            <button className="mx-2" onClick={() => handleImgChange('next')}>
              Next
            </button>
          </div>
        </div>
      )}
      <MasonryLayout>
        {images
          .filter((img: any) => img.name !== '.emptyFolderPlaceholder')
          .map((img: any, ind: any) => {
            return (
              <button
                onClick={() => (setImage ? setImage(img) : setEnlargedImg(img))}
                className={`relative w-full mb-[5px] rounded-xl overflow-hidden ${
                  ind % 2 === 1 && 'break-after-right'
                }`}
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
                />
              </button>
            );
          })}
      </MasonryLayout>
    </div>
  );
}
