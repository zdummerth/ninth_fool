import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { Product } from 'types';
import { GetStaticPropsResult } from 'next';
import Image from 'next/image';
import probe from 'probe-image-size';
interface Props {
  products: Product[];
  publicImages: any;
}

interface Image {
  name: string;
  id: string;
  updated_at: Date;
  created_at: Date;
  last_accessed_at: Date;
  metadata: any;
}

export default function PricingPage({ products, publicImages }: Props) {
  // console.log(publicImages);
  return (
    <div>
      {/* <Pricing products={products} /> */}
      <h1>The Ninth Fool</h1>
      <div className="columns-2 w-full">
        {publicImages
          .filter((img: any) => img.name !== '.emptyFolderPlaceholder')
          .map((img: any) => {
            return (
              <div className="relative w-full">
                <Image
                  src={img.url}
                  layout="responsive"
                  width={img.width}
                  height={img.height}
                  key={img.id}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();
  const { data, error } = await supabaseAdmin.storage
    .from('public-images')
    .list('', {
      limit: 100,
      offset: 0
    });

  const images = await Promise.all(
    data
      .filter((img) => img.name !== '.emptyFolderPlaceholder')
      .map(async (i) => {
        // console.log(i);
        const imgData = await probe(
          `https://iyepowyaftcjvbuntjts.supabase.co/storage/v1/object/public/public-images/${i.name}`
        );
        return { ...i, ...imgData };
      })
  );

  return {
    props: {
      products,
      publicImages: images
    },
    revalidate: 60
  };
}
