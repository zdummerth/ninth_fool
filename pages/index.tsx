import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import { useUser } from 'utils/useUser';

import Image from 'next/image';
import Link from 'next/link';
import mobilebg from 'public/mobile-bg.png';
// import desktopbg from 'public/desktop-bg.png';
import desktopbg from 'public/bg.svg';

interface Props {
  publicImages: any;
}

export default function HomePage({ publicImages }: Props) {
  // console.log(publicImages);
  const { user, subscription, isLoading } = useUser();

  const linkClassName =
    'block p-2 my-8 w-64 rounded-xl text-center shadow shadow-white bg-emerald-500 color black';
  return (
    <div>
      {/* <Pricing products={products} /> */}
      {/* <h1>The Ninth Fool</h1> */}
      <div className="lg:hidden">
        <Image src={mobilebg} layout="responsive" placeholder="blur" />
      </div>
      <div className="hidden lg:block">
        <Image src={desktopbg} layout="responsive" 
        // placeholder="blur" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mx-2">
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
