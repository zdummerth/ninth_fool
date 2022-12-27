import Image from 'next/image';
import ImageForm from '@/components/ImageForm';
import callApi from '@/utils/callApi';

interface Props {
  images: any;
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

export default function ImageList({ images }: Props) {
  const handleSubmit: any = async (data: any, id: any) => {
    try {
      const res = await callApi('/api/update-image', 'POST', {
        id: id,
        tagstring: data.tagstring
      });

      if (res.error) {
        throw res.error;
      }
      console.log('success');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <MasonryLayout>
        {images
          .filter((img: any) => img.name !== '.emptyFolderPlaceholder')
          .map((img: any, ind: any) => {
            if (ind === 0) console.log(img.tagstring);
            return (
              <div key={img.signedUrl}>
                <div
                  className={`relative w-full mb-[5px] rounded-xl overflow-hidden`}
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
                </div>
                <div className="m-2">
                  <ImageForm
                    onSubmit={async (data: any) => {
                      await handleSubmit(data, img.id);
                    }}
                    defaultValues={{
                      tagstring: img.tagstring,
                      caption: img.tagstring
                    }}
                  />
                </div>
              </div>
            );
          })}
      </MasonryLayout>
    </div>
  );
}
