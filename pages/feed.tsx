import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import useSWRInfinite from 'swr/infinite';
import callApi from '@/utils/callApi';
import { useState } from 'react';
import ImageList from '@/components/ImageList';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/router';
import SearchTags from '@/components/SearchTags';
import SearchTagsAlt from '@/components/SearchTagsAlt';
import { GetServerSidePropsContext } from 'next';

export default function FeedPage(props: any) {
  const router = useRouter();
  const [feedArgs, setFeedArgs] = useState({
    searchTerm: ''
  });

  const getKey = (pageIndex: any, previousPageData: any) => {
    if (previousPageData && !previousPageData.images.length) return null; // reached the end

    return `/api/get-signed-urls?page=${pageIndex}${
      feedArgs.searchTerm ? `&searchTerm=${feedArgs.searchTerm}` : ''
    }`;
  };

  const { data, size, setSize, error, isValidating } = useSWRInfinite(
    getKey,
    (key) => callApi(key, 'POST', feedArgs),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      initialSize: 1
    }
  );

  if (error) {
    return (
      <div>There was an error loading images, please reload to try again.</div>
    );
  }

  const newdata = data ? data : [];
  const allImages = newdata.map((d) => d.images).flat();

  console.log('image ', allImages[0]);

  return (
    <div className="p-2">
      <div className="hidden" id="top" />
      <div className="flex items-center p-4 w-full sticky top-0 bg-black z-40 transition-all duration-150">
        {props.tags && (
          // <SearchTags
          //   counts={props.counts}
          //   setTag={(t: any) => {
          //     setFeedArgs({ searchTerm: t });
          //     setSize(1);
          //     router.push('#top');
          //   }}
          // />
          <SearchTagsAlt
            tags={props.tags}
            setTag={(t: any) => {
              setFeedArgs({ searchTerm: t });
              setSize(1);
              router.push('#top');
            }}
          />
        )}
      </div>
      {!data && !error ? (
        <div className="flex justify-center">
          <LoadingDots />
        </div>
      ) : (
        <>
          {allImages.length > 0 && (
            <ImageList showForm={false} images={allImages} />
          )}
        </>
      )}
      {allImages.length < newdata[0]?.count && (
        <div className="flex justify-center">
          <div>
            <button
              className="border w-[125px] px-3 rounded"
              onClick={() => setSize(size + 1)}
            >
              {isValidating ? <LoadingDots /> : 'Load More'}
            </button>
          </div>
        </div>
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

  const tags = Object.keys(counts).map((t) => ({
    name: t,
    count: counts[t],
    value: t,
    label: `${t}  (${counts[t]})`
  }));

  return {
    props: {
      counts: counts ?? [],
      tags: tags.length > 0 ? tags : []
    }
  };
};
