import { useState } from 'react';
import SearchIcon from '@/components/icons/Search';

export default function SearchTags(props: any) {
  const imageTags = props.counts;
  const setTag = props.setTag;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="p-2" onClick={() => setIsOpen(true)}>
        <SearchIcon />
      </button>

      {isOpen && (
        <div className="fixed z-40 left-0 top-0 w-screen h-screen bg-black/75 pt-20 flex justify-center items-center">
          <div className="absolute h-3/4 w-3/4 bg-black">
            <button
              className="ml-5 mb-5 bg-black p-4"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
            <div className="overflow-auto left-0 top-0 h-full w-full bg-black">
              {imageTags && (
                <div className="flex flex-col gap-2 p-2">
                  {Object.keys(imageTags).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTag(t);
                        setIsOpen(false);
                      }}
                      className={`flex justify-between border rounded p-2`}
                    >
                      <div className="mr-2">{t}</div>
                      <div>({imageTags[t]})</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
