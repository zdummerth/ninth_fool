import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { getImageTags } from '@/utils/supabase-admin';
import { TagForSearch } from 'types';
import PaginatedImages from '@/components/PaginatedImages';

export default function FeedPage({ tags }: { tags: TagForSearch[] }) {
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
          destination: '/',
          permanent: false
        }
      };

    const { tags } = await getImageTags(supabase);

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
