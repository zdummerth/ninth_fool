import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { getImageTags } from '@/utils/supabase-admin';
import { TagForSearch } from 'types';
import PaginatedImages from '@/components/PaginatedImages';
import { getSubscription } from '@/utils/supabase-admin';

interface Props {
  tags: TagForSearch[];
}
export default function FeedPage({ tags }: Props) {
  return <PaginatedImages tags={tags} showForm={false} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  try {
    const supabase = createServerSupabaseClient(ctx);

    // Removed subscription and session check for now to allow all users to view feed

    // const {
    //   data: { session }
    // } = await supabase.auth.getSession();

    // if (!session)
    //   return {
    //     redirect: {
    //       destination: '/signin',
    //       permanent: false
    //     }
    //   };

    // const { subscription, error } = await getSubscription(supabase);

    // if (error || !subscription)
    //   return {
    //     redirect: {
    //       destination: '/pricing',
    //       permanent: false
    //     }
    //   };
    const { tags } = await getImageTags(supabase, true);

    return {
      props: {
        tags
      }
    };
  } catch (e) {
    return {
      props: {
        tags: []
      }
    };
  }
};
