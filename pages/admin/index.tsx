import { useState } from 'react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getImageTags } from '@/utils/supabase-admin';
import { GetServerSidePropsContext } from 'next';
import PaginatedImages from '@/components/PaginatedImages';
import { TagForSearch } from 'types';
import FileUploader from 'components/FileUploader';

export default function AdminIndex({ tags }: { tags: TagForSearch[] }) {
  const [tab, setTab] = useState('uploader');
  return (
    <div className="">
      <div className="flex gap-4 justify-center mb-10">
        <button
          className={`pb-2 ${tab === 'uploader' && 'border-b-2'}`}
          onClick={() => setTab('uploader')}
        >
          Uploader
        </button>
        <button
          className={`pb-2 ${tab === 'images' && 'border-b-2'}`}
          onClick={() => setTab('images')}
        >
          Images
        </button>
      </div>
      {tab === 'uploader' ? (
        <FileUploader />
      ) : (
        <PaginatedImages tags={tags} showForm={true} />
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  try {
    const supabase = createServerSupabaseClient(ctx);

    const user = await supabase.auth.getUser();
    if (
      !(
        user?.data?.user?.email &&
        user?.data?.user?.email === process.env.ADMIN_EMAIL
      )
    ) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

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
