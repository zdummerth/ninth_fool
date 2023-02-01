import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import { useUser } from 'utils/useUser';
import Image from 'next/image';
import Link from 'next/link';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
import blackrose from 'public/brose.png';
import { getProducts } from '@/utils/callShopify';
import ProductList from '@/components/ProductList';
import Logo from 'components/ui/Logo';
import Seo from '@/components/SEO';
import { ShopifyProduct } from 'types';

interface Props {
  publicImages: string[];
  products: ShopifyProduct[];
}

export default function HomePage({ publicImages, products }: Props) {
  console.log('all products: ', products);
  const { user, subscription, isLoading } = useUser();

  const linkClassName =
    'block p-2 my-8 w-64 rounded-xl text-center shadow shadow-white bg-emerald-500 color black';

  const description = `Unleash your inner artist and transform your space with endless
            possibilities of art! With The Ninth Fool, you can have access to a
            world-class collection of digital art prints that you can download
            anytime, anywhere. Our membership program makes it easy and
            affordable for you to decorate your home, office, or anywhere else
            with stunning art pieces that will inspire and delight you. Say
            goodbye to boring spaces and hello to a world filled with creativity
            and beauty. Join The Ninth Fool today and start experiencing the
            magic of art!`;

  return (
    <>
      <Seo title="Home" description={description} />
      <div className="fixed top-0 left-0 w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 z-10"></div>
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
            The Ninth Fool
          </h1>
          <h2 className="text-xl text-shadow-dark">
            Experience the Magic of Art, Anytime, Anywhere
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mx-4">
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

        <div className="flex flex-col items-center text-center dark-gradient rounded py-10 m-2">
          <div className="relative w-48">
            <Logo />
          </div>
          <p className="text-xl max-w-xl mx-auto mt-10">{description}</p>
          <div className="flex justify-center">
            {user && subscription && !isLoading && (
              <Link href="/feed">
                <a className={linkClassName}>View More Images</a>
              </Link>
            )}
            {user && !subscription && !isLoading && (
              <Link href="/pricing">
                <a className={linkClassName}>Subscribe Now</a>
              </Link>
            )}
            {!user && !isLoading && (
              <Link href="/signin">
                <a className={linkClassName}>Sign Up Now</a>
              </Link>
            )}
          </div>
        </div>
        <div className="text-center dark-gradient rounded py-10 m-2">
          <h2 className="text-xl">Featured Downloads</h2>
        </div>
        <div className="mx-2">
          <ProductList products={products} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const { data } = await supabaseAdmin.storage.from('public-images').list('', {
    limit: 9,
    offset: 0
  });
  const allProducts = await getProducts({ first: 5 });

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
