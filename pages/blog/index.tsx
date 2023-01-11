import { getAllPosts } from 'utils/markdown-helpers';
import { serialize } from 'next-mdx-remote/serialize';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  posts: any;
  tags: any;
};

const PostCard = ({ p }: any) => {
  return (
    <Link href={`/blog/${p.slug}`}>
      <a className="relative w-full group block">
        <div className="absolute top-0 w-full p-2 bg-black/50 z-10 text-center group-hover:text-xl">
          {p.title}
        </div>
        <Image
          src={p.featured_image}
          alt={p.title}
          width={300}
          height={200}
          layout="responsive"
        />
      </a>
    </Link>
  );
};

export default function PostIndex({ posts, tags }: Props) {
  return (
    <div>
      <div className="flex">
        {posts.map((p: any) => (
          <PostCard key={p.title} p={p} />
        ))}
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
  const posts = getAllPosts();
  const postssource = await Promise.all(
    posts.map(async (post) => {
      const source = await serialize(post.content, { parseFrontmatter: true });
      return {
        ...source.frontmatter,
        slug: post.slug
      };
    })
  );

  const allTags = postssource.map((p: any) => p.tags).flat();
  const uniqueTagsSet = new Set(allTags);
  const uniqueTagsArray = Array.from(uniqueTagsSet);
  return {
    props: {
      posts: postssource,
      tags: uniqueTagsArray
    }
  };
}
