import Masonry from 'react-masonry-css';

export default function MasonryLayout({ children }: any) {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1100: 4,
        900: 3,
        700: 2,
        500: 1
      }}
      className="flex ml-[-5px]"
      columnClassName="pl-[5px]"
    >
      {children}
    </Masonry>
  );
}
