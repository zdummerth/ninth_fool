import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import { useUser } from 'utils/useUser';
import Image from 'next/image';
import Link from 'next/link';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
import { getProducts } from '@/utils/callShopify';
import ProductList from '@/components/ProductList';

interface Props {
  publicImages: string[];
  products: any;
}

export default function HomePage({ publicImages, products }: Props) {
  const { user, subscription, isLoading } = useUser();

  const linkClassName =
    'block p-2 my-8 w-64 rounded-xl text-center shadow shadow-white bg-emerald-500 color black';

  return (
    <>
      <div className="fixed top-0 left-0 w-full">
        <Image
          src={mobilebg}
          layout="responsive"
          objectFit="cover"
          placeholder="blur"
          className="lg:hidden"
        />
        <Image
          src={desktopbg}
          layout="responsive"
          objectFit="cover"
          className="hidden lg:block"
          priority
        />
      </div>
      <div className="py-20 relative z-10">
        <div className="text-center bg-black/90 m-8 rounded py-20">
          <h1 className="text-3xl mb-8 font-bold">The Ninth Fool</h1>
          <h2 className="text-xl">A Gallery of AI Generated Digital Art</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mx-8">
          {publicImages.map((i: string) => {
            return (
              <div
                key={i}
                className="relative w-full aspect-[1/1] rounded-xl overflow-hidden"
              >
                <Image src={i} layout="fill" objectFit="cover" />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          {user && subscription && !isLoading && (
            <Link href="/feed">
              <a className={linkClassName}>View More Images</a>
            </Link>
          )}
          {user && !subscription && !isLoading && (
            <Link href="/pricing">
              <a className={linkClassName}>Subscribe For More Images</a>
            </Link>
          )}
          {!user && !isLoading && (
            <Link href="/signin">
              <a className={linkClassName}>Sign Up For More Images</a>
            </Link>
          )}
        </div>
        <div className="text-center bg-black/90 m-8 rounded py-10">
          <h2 className="text-xl">Featured Downloads</h2>
        </div>
        <div className="mx-8">
          <ProductList products={products} />
        </div>
      </div>
    </>
  );
}

const H1 = ({ title }: any) => {
  return <h1>{title}</h1>;
};

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const { data } = await supabaseAdmin.storage.from('public-images').list('', {
    limit: 21,
    offset: 0
  });
  const allProducts = await getProducts({ first: 5 });
  console.log('all products: ', allProducts);

  if (data) {
    const images = data
      .filter((img) => img.name !== '.emptyFolderPlaceholder')
      .map(
        (i) =>
          `https://iyepowyaftcjvbuntjts.supabase.co/storage/v1/object/public/public-images/${i.name}`
      );

    return {
      props: {
        publicImages: images,
        products: allProducts
      }
    };
  } else {
    return {
      props: {
        publicImages: [],
        products: []
      }
    };
  }
}
