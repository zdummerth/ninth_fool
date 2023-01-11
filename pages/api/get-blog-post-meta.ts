import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllPosts } from '@/utils/markdown-helpers';

type ResponseError = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  const posts = getAllPosts();
  const postssource = await Promise.all(
    posts.map(async (post) => {
      const source = await serialize(post.content, { parseFrontmatter: true });
      //   return {
      //     ...source,
      //     slug: post.slug
      //   };
      //   console.log('slug: ', post.slug);
      return {
        ...source.frontmatter,
        slug: post.slug
      };
    })
  );

  return posts.length > 0
    ? res.status(200).json({ posts: postssource })
    : res.status(404).json({ message: `blog posts not found.` });
}
