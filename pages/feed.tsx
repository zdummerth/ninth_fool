import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { getImageTags } from '@/utils/supabase-admin';
import { TagForSearch, Subscription } from 'types';
import PaginatedImages from '@/components/PaginatedImages';
import { useUser } from 'utils/useUser';
import { getSubscription } from '@/utils/supabase-admin';

export default function FeedPage({
  tags,
  subsciption
}: {
  tags: TagForSearch[];
  subsciption: Subscription;
}) {
  const { hasSubscription } = useUser();
  console.log(hasSubscription);
  return (
    <div className="">
      <PaginatedImages tags={tags} showForm={false} />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  try {
    const supabase = createServerSupabaseClient(ctx);

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session)
      return {
        redirect: {
          destination: '/signin',
          permanent: false
        }
      };

    const { subscription, error } = await getSubscription(supabase);

    if (error)
      return {
        redirect: {
          destination: '/pricing',
          permanent: false
        }
      };
    const { tags } = await getImageTags(supabase);

    return {
      props: {
        tags,
        subscription
      }
    };
  } catch (e) {
    return {
      props: {
        tags: [],
        subscription: null
      }
    };
  }
};
