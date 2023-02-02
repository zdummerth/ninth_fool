import useSWRInfinite from 'swr/infinite';
import { useState } from 'react';
import callApi from '@/utils/callApi';
import ImageList from '@/components/ImageList';
import AdminImageList from '@/components/AdminImageList';
import { useRouter } from 'next/router';
import { ImagePageData, TagForSearch } from 'types';
import SearchTags from '@/components/SearchTags';
import LoadingDots from '@/components/ui/LoadingDots';

export default function PaginatedImages({
  tags,
  showForm
}: {
  tags: TagForSearch[];
  showForm: boolean;
}) {
  const router = useRouter();
  const [feedArgs, setFeedArgs] = useState({
    searchTerm: ''
  });

  const getKey = (pageIndex: number, previousPageData: ImagePageData) => {
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

  return (
    <div className="p-2">
      <div className="hidden" id="top" />
      <div className="flex items-center p-4 w-full sticky top-0 bg-black z-20 transition-all duration-150">
        {tags && (
          <SearchTags
            tags={tags}
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
            <>
              {showForm ? (
                <AdminImageList images={allImages} />
              ) : (
                <ImageList images={allImages} />
              )}
            </>
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
