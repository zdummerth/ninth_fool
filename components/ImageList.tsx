import Image from 'next/image';
interface Props {
  images: any;
}

export default function ImageList({ images }: Props) {
  return (
    <div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 w-full">
        {images
          .filter((img: any) => img.name !== '.emptyFolderPlaceholder')
          .map((img: any) => {
            return (
              <div
                className="relative w-full mb-4 rounded-xl overflow-hidden shadow shadow-white"
                key={img.id ? img.id : img.url}
              >
                <Image
                  src={img.url}
                  layout="responsive"
                  width={img.width}
                  height={img.height}
                  key={img.id ? img.id : img.url}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
