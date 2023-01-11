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
      <a className="relative w-full group block border overflow-hidden rounded">
        <div className="absolute top-0 w-full p-2 bg-black/75 z-10 text-center">
          {p.title}
        </div>
        <div className="relative w-full group-hover:scale-125 transition ease-in-out">
          <Image
            src={p.featured_image}
            alt={p.title}
            width={300}
            height={200}
            layout="responsive"
          />
        </div>
      </a>
    </Link>
  );
};

export default function PostIndex({ posts, tags }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mx-2">
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
