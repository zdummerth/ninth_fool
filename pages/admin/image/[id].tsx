import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { GetServerSidePropsContext } from 'next';

export default function FeedPage(props: any) {
  console.log(props);
  return <div className="p-2">Image Page</div>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client

  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session }
  } = await supabase.auth.getSession();
  console.log(ctx.params);

  if (!session || session.user.email !== process.env.ADMIN_EMAIL)
    return {
      redirect: {
        destination: '/',

        permanent: false
      }
    };

  // Run queries with RLS on the server
  const id = ctx.params?.id ? ctx.params.id : '';

  const { data, error } = await supabase
    .from('paid-images')
    .select('*')
    .eq('id', id);

  if (error) {
    console.log(error);
  }

  return {
    props: {
      counts: data
    }
  };
};
