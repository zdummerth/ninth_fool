import useSWR from 'swr';
import callApi from './callApi';

export default function () {
  const { data, error, isValidating } = useSWR(
    '/api/get-blog-post-meta',
    callApi,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    data,
    error,
    loading: !data && !error,
    isValidating
  };
}
