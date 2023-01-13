// import { useRouter } from 'next/router';
// import ErrorPage from 'next/error';
import { serialize } from 'next-mdx-remote/serialize';
import { getPostBySlug, getAllPosts } from 'utils/markdown-helpers';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';

type Props = {
  post: any;
};

export default function Post({ post }: Props) {
  //   const router = useRouter();
  //   if (!router.isFallback && !post?.slug) {
  //     return <ErrorPage statusCode={404} />;
  //   }
  return (
    <>
      <div className="max-w-2xl m-auto">
        <div className="relative w-full">
          <Image
            src={post.frontmatter.featured_image}
            alt={post.frontmatter.title}
            width={1536}
            height={1024}
            layout="responsive"
          />
        </div>
        <div className="p-2">
          <MDXRemote {...post} />
        </div>
      </div>
      <style>
        {`
          h1 {
            font-size: 24px;
            margin-bottom: 12px;
            text-align: center;
          }
        `}
      </style>
    </>
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
