import { withApiAuth } from '@supabase/auth-helpers-nextjs';

export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
  // Run queries with RLS on the server
  //   console.log('in get signed urls function', req.body);

  const { data, error } =
    req.body.searchTerm === ''
      ? await supabase
          .from('paid-images')
          .select('filepath, tagstring, width, height')
          .range(0, 2)
          .order('created_at', { ascending: false })
      : await supabase
          .from('paid-images')
          .select('filepath, tagstring, width, height')
          .textSearch('tagstring', req.body.searchTerm, {
            type: 'phrase',
            config: 'english'
          })
          .range(0, 2)
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
    images: imagesArray
  });
});
