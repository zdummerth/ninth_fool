import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { Product } from 'types';
import { GetStaticPropsResult } from 'next';
import ImageList from '@/components/ImageList';
import probe from 'probe-image-size';
interface Props {
  publicImages: any;
}

export default function HomePage({ publicImages }: Props) {
  // console.log(publicImages);
  return (
    <div>
      {/* <Pricing products={products} /> */}
      <h1>The Ninth Fool</h1>
      <ImageList images={publicImages} />
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
