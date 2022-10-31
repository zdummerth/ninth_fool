import { User, withPageAuth } from '@supabase/auth-helpers-nextjs';
import useSWR from 'swr';
import callApi from '@/utils/callApi';
import { useState } from 'react';
import ImageList from '@/components/ImageList';
import { useForm } from 'react-hook-form';
import FilterIcon from '@/components/icons/Filter';
// import SearchIcon from '@/components/icons/Search';
export default function FeedPage() {
  const [feedArgs, setFeedArgs] = useState({
    page: 1,
    searchTerm: '',
    filterOpen: false
  });

  const { data: imageTags, error: imageTagError } = useSWR(
    ['/api/get-image-tags'],
    () => callApi('/api/get-image-tags', 'GET')
  );
  const { data, error } = useSWR(
    ['/api/get-signed-urls', feedArgs.page, feedArgs.searchTerm],
    () => callApi('/api/get-signed-urls', 'POST', feedArgs)
  );

  if (error) {
    return (
      <div>There was an error loading images, please reload to try again.</div>
    );
  }
  console.log(imageTags, imageTagError);
  return (
    <div className="p-4">
      <div className="">
        {/* <form
          className="flex justify-center items-center my-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="bg-zinc-700 p-2 rounded mr-2"
            placeholder="search images"
            {...register('searchTerm', { required: true })}
          />
          <button>
            <SearchIcon />
          </button>
        </form> */}
        <button
          className="ml-4 mb-4"
          onClick={() => setFeedArgs({ ...feedArgs, filterOpen: true })}
        >
          <FilterIcon />
        </button>
        {feedArgs.searchTerm && (
          <span className="flex w-fit border rounded p-2 my-8">
            <span className="mr-4">{feedArgs.searchTerm}</span>
            <button
              onClick={() =>
                setFeedArgs({ ...feedArgs, filterOpen: false, searchTerm: '' })
              }
            >
              X
            </button>
          </span>
        )}
        {feedArgs.filterOpen && (
          <div className="fixed z-40 left-0 top-0 w-screen h-screen bg-black/75 pt-20 flex justify-center items-center">
            <div className="absolute h-3/4 w-3/4 bg-black">
              <button
                className="ml-5 mb-5 bg-black p-4"
                onClick={() => setFeedArgs({ ...feedArgs, filterOpen: false })}
              >
                X
              </button>
              <div className="overflow-auto left-0 top-0 h-full w-full bg-black">
                {imageTags && !imageTagError && (
                  <div className="flex flex-col gap-2 p-2">
                    {Object.keys(imageTags).map((t) => (
                      <button
                        onClick={() =>
                          setFeedArgs({
                            page: 1,
                            searchTerm: t,
                            filterOpen: false
                          })
                        }
                        className={`flex justify-between rounded p-2 ${
                          feedArgs.searchTerm === t
                            ? 'border-emerald-400 border-4'
                            : `border`
                        }`}
                      >
                        <div className="mr-2">{t}</div>
                        <div>({imageTags[t]})</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {!data && !error ? (
        <div>loading</div>
      ) : (
        <ImageList images={data.images} />
      )}
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/'
});
