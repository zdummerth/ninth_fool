import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import Image from 'next/image';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
interface Props {
  publicImages: any;
}

export default function HomePage({ publicImages }: Props) {
  // console.log(publicImages);
  return (
    <div>
      {/* <Pricing products={products} /> */}
      {/* <h1>The Ninth Fool</h1> */}
      <div className="lg:hidden">
        <Image src={mobilebg} layout="responsive" placeholder="blur" />
      </div>
      <div className="hidden lg:block">
        <Image src={desktopbg} layout="responsive" placeholder="blur" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {publicImages.map((i: string) => {
          return (
            <div key={i} className="relative w-full aspect-[1/1]">
              <Image src={i} layout="fill" objectFit="cover" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  // const products = await getActiveProductsWithPrices();
  const { data, error } = await supabaseAdmin.storage
    .from('public-images')
    .list('', {
      limit: 100,
      offset: 0
    });

  if (data) {
    const images = data
      .filter((img) => img.name !== '.emptyFolderPlaceholder')
      .map((i) => {
        // console.log(i);
        return `https://iyepowyaftcjvbuntjts.supabase.co/storage/v1/object/public/public-images/${i.name}`;
      });

    return {
      props: {
        publicImages: images
      }
      // revalidate: 60
    };
  } else {
    return {
      props: {
        publicImages: []
      }
    };
  }
}
