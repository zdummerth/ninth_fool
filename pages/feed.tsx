import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import useSWR from 'swr';
import callApi from '@/utils/callApi';
import { useState } from 'react';
import ImageList from '@/components/ImageList';
import SearchTags from '@/components/SearchTags';
import LoadingDots from '@/components/ui/LoadingDots';

import { GetServerSidePropsContext } from 'next';

export default function FeedPage(props: any) {
  console.log('feed mounted');
  const imageTags = props.counts;
  const [feedArgs, setFeedArgs] = useState({
    page: 1,
    searchTerm: ''
  });

  const { data, error } = useSWR(
    ['/api/get-signed-urls', feedArgs.page, feedArgs.searchTerm],
    () => callApi('/api/get-signed-urls', 'POST', feedArgs),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  if (error) {
    return (
      <div>There was an error loading images, please reload to try again.</div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center my-4">
        {imageTags && (
          <SearchTags
            counts={imageTags}
            setTag={(t: string) => setFeedArgs({ page: 1, searchTerm: t })}
          />
        )}
        {feedArgs.searchTerm && (
          <span className="flex w-fit border rounded p-2 ml-8">
            <span className="mr-4">{feedArgs.searchTerm}</span>
            <button
              onClick={() =>
                setFeedArgs({
                  ...feedArgs,
                  searchTerm: ''
                })
              }
            >
              X
            </button>
          </span>
        )}
      </div>
      {!data && !error ? (
        <div className="flex justify-center">
          <LoadingDots />
        </div>
      ) : (
        <ImageList images={data.images} />
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client

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

  // Run queries with RLS on the server

  const { data, error } = await supabase
    .from('paid-images')
    .select('tagstring');

  if (error) {
    console.log(error);
  }

  const tagsArray = data
    ? data.map((t) => t.tagstring.split(',').map((t1: any) => t1.trim())).flat()
    : [];

  const counts: any = {};

  for (const tag of tagsArray) {
    counts[tag] = counts[tag] ? counts[tag] + 1 : 1;
  }

  return {
    props: {
      counts: counts ?? []
    }
  };
};
