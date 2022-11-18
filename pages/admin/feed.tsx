import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import useSWRInfinite from 'swr/infinite';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import callApi from '@/utils/callApi';
import { useState } from 'react';
import ImageForm from '@/components/ImageForm';
import SearchTags from '@/components/SearchTags';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { GetServerSidePropsContext } from 'next';

export default function FeedPage(props: any) {
  const imageTags = props.counts;
  const supabase = useSupabaseClient<any>();

  const router = useRouter();
  const [feedArgs, setFeedArgs] = useState<any>({
    searchTerm: '',
    imageForm: null,
    loading: false
  });

  const handleSubmit: any = async (data: any) => {
    // console.log(data);
    // console.log(feedArgs.imageForm);
    try {
      setFeedArgs({ ...feedArgs, loading: true });

      const res = await callApi('/api/update-image', 'POST', {
        id: feedArgs.imageForm.id,
        tagstring: data.tagstring
      });

      if (res.error) {
        throw res.error;
      }

      console.log(res);

      alert('success');
    } catch (error) {
      // alert(error);
      console.log(error);
    } finally {
      setFeedArgs({ ...feedArgs, loading: false });
    }
  };

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

  // console.log('feed data: ', allImages[0]);

  return (
    <div className="p-2">
      <div className="hidden" id="top" />
      <div className="flex items-center p-4 w-full sticky top-0 bg-black z-40 transition-all duration-150">
        {imageTags && (
          <SearchTags
            counts={imageTags}
            setTag={(t: string) => {
              setFeedArgs({ searchTerm: t, imageForm: null });
              setSize(1);
              router.push('#top');
            }}
          />
        )}
        {feedArgs.searchTerm && (
          <span className="flex w-fit border rounded p-2 ml-8">
            <span className="mr-4">{feedArgs.searchTerm}</span>
            <button
              onClick={() => {
                setFeedArgs({
                  searchTerm: '',
                  imageForm: null
                });
                setSize(1);
                router.push('#top');
              }}
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
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mx-2">
            {allImages.map((i: any) => {
              return (
                <button
                  key={i.signedUrl}
                  onClick={() => setFeedArgs({ ...feedArgs, imageForm: i })}
                  className="relative w-full aspect-[1/1] rounded-xl overflow-hidden"
                >
                  <Image src={i.signedUrl} layout="fill" objectFit="cover" />
                </button>
              );
            })}
          </div>
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

      {feedArgs.imageForm && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black">
          <button
            className="p-4"
            onClick={() => setFeedArgs({ ...feedArgs, imageForm: null })}
          >
            X
          </button>
          <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden">
            <Image
              src={feedArgs.imageForm.signedUrl}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="m-2">
            <ImageForm
              onSubmit={handleSubmit}
              loading={feedArgs.loading}
              defaultValues={{
                tagstring: feedArgs.imageForm.tagstring,
                caption: feedArgs.imageForm.tagstring
              }}
            />
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
  // console.log(session);

  if (!session || session.user.email !== process.env.ADMIN_EMAIL)
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
