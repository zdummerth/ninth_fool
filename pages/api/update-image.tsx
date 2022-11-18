import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/utils/supabase-admin';
export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
  // Run queries with RLS on the server
  console.log('in get update image function', req.body);

  const data = await supabaseAdmin
    .from('paid-images')
    .update({ tagstring: req.body.tagstring })
    .eq('id', req.body.id);

  return res.json({
    data: data.data,
    error: data.error
  });
});
