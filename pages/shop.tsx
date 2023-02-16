import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import { useUser } from 'utils/useUser';
import Image from 'next/image';
import InternalLink from '@/components/ui/InternalLink';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
import blackrose from 'public/brose.png';
import { getProducts } from '@/utils/callShopify';
import ProductList from '@/components/ProductList';
import Logo from 'components/ui/Logo';
import Seo from '@/components/SEO';
import { ShopifyProduct } from 'types';

interface Props {
  products: ShopifyProduct[];
}

export default function HomePage({ products }: Props) {
  const description = `Check out all of our latest items`;

  return (
    <>
      <Seo title="Shop" description={description} />
      <div className="relative z-10">
        <div className="relative text-center m-4 rounded overflow-hidden py-20">
          <div className="absolute top-0 left-0 w-full h-full -z-20 ">
            <Image
              src={blackrose}
              layout="fill"
              objectFit="cover"
              className=""
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl mb-8 font-bold text-shadow-dark">
            The Ninth Fool Shop
          </h1>
        </div>

        <div className="text-center dark-gradient rounded py-10 m-2">
          <h2 className="text-xl">Featured Downloads</h2>
        </div>
        <div className="mx-2">
          <ProductList products={products} variation="standard" />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  try {
    const allProducts = await getProducts({ first: 5 });
    return {
      props: {
        products: allProducts
      }
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        products: []
      }
    };
  }
}
