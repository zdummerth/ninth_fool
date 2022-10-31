import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import probe from 'probe-image-size';

export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
  // Run queries with RLS on the server
  console.log('in get get image tags function', req.body);

  const { data, error } = await supabase
    .from('paid-images')
    .select('tagstring');

  if (error) {
    return res.json(error);
  }

  const tagsArray = data
    ? data.map((t) => t.tagstring.split(',').map((t1: any) => t1.trim())).flat()
    : [];

  // console.log(tagsArray);
  const counts: any = {};

  for (const tag of tagsArray) {
    counts[tag] = counts[tag] ? counts[tag] + 1 : 1;
  }

  console.log(counts);

  return res.json(counts);
});
