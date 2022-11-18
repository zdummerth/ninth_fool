import { withApiAuth } from '@supabase/auth-helpers-nextjs';

export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
  // Run queries with RLS on the server
  console.log('in get signed urls function', req.query);
  const pageIndex: any = req.query.page;
  const limit = process.env.NODE_ENV === 'development' ? 5 : 50;
  const start = pageIndex * limit;
  const end = start + limit - 1;

  const { data, error, statusText, count, status } = !req.query.searchTerm
    ? await supabase
        .from('paid-images')
        .select('id, filepath, tagstring, width, height', {
          count: 'exact',
          head: false
        })
        .range(start, end)
        .order('created_at', { ascending: false })
    : await supabase
        .from('paid-images')
        .select('id, filepath, tagstring, width, height', {
          count: 'exact',
          head: false
        })
        .textSearch('tagstring', req.body.searchTerm, {
          type: 'phrase',
          config: 'english'
        })
        .range(start, end)
        .order('created_at', { ascending: false });

  if (error) {
    return res.json(error);
  }

  if (data?.length === 0) {
    return res.json({
      images: []
    });
  }

  const filepaths = data ? data.map((file) => file.filepath) : [];

  const { data: urls, error: urlError } = await supabase.storage
    .from('paid-images')
    .createSignedUrls(filepaths, 600);

  if (urlError) {
    return res.json(urlError);
  }

  const urlArr = urls ? urls : [];
  const imagesArray = urlArr.map((i) => {
    // console.log(i);
    const imgData = data?.find((img) => i.signedUrl.includes(img.filepath));
    return { ...i, ...imgData };
  });

  return res.json({
    statusText,
    count,
    images: imagesArray
  });
});
