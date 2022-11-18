import { useUser } from 'utils/useUser';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { GetServerSidePropsContext } from 'next';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';

import Image from 'next/image';
import Link from 'next/link';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
interface Props {
  images: any;
}

export default function AdminPage({ images }: Props) {
  console.log(images);
  const { user, subscription, isLoading } = useUser();

  const linkClassName =
    'block p-2 my-8 w-64 rounded-xl text-center shadow shadow-white bg-emerald-500 color black';
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mx-2">
        {images.map((i: string) => {
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

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx, supabase) {
    // Run queries with RLS on the server
    // const { data } = await supabase.from('test').select('*');
    const user = await supabase.auth.getUser();
    if (
      user?.data?.user?.email &&
      user?.data?.user?.email === process.env.ADMIN_EMAIL
    ) {
      const supabase = createServerSupabaseClient(ctx);

      // Run queries with RLS on the server

      const { data, error } = await supabase.from('paid-images').select('*');

      if (error) {
        console.log(error);
      }

      return {
        props: {
          images: data
        }
      };
    }
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
});
