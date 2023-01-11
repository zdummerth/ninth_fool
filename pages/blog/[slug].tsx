// import { useRouter } from 'next/router';
// import ErrorPage from 'next/error';
import { serialize } from 'next-mdx-remote/serialize';
import { getPostBySlug, getAllPosts } from 'utils/markdown-helpers';
import { MDXRemote } from 'next-mdx-remote';
type Props = {
  post: any;
};

export default function Post({ post }: Props) {
  //   const router = useRouter();
  //   if (!router.isFallback && !post?.slug) {
  //     return <ErrorPage statusCode={404} />;
  //   }
  console.log(post.frontmatter);
  return (
    <div>
      <div>
        <MDXRemote {...post} />
      </div>
    </div>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug);
  const source = await serialize(post.content, { parseFrontmatter: true });

  return {
    props: {
      post: source
    }
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post: any) => {
      return {
        params: {
          slug: post.slug
        }
      };
    }),
    fallback: false
  };
}
