import Head from 'next/head';

interface PageProps {
  title?: string;
  description?: string;
}
const Seo = ({
  title = 'Title',
  description = 'Page Description'
}: PageProps) => {
  return (
    <Head>
      <title>{`The Ninth Fool | ${title}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default Seo;
