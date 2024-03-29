import React from 'react';
import Select from 'react-select';

export default ({ tags, setTag }: any) => {
  return (
    <>
      <Select
        className="w-full text-white border rounded"
        classNames={{
          control: () => 'px-1',
          option: ({ isFocused, isSelected }) =>
            isSelected
              ? 'bg-emerald-800 p-1'
              : isFocused
              ? 'bg-slate-900 p-1'
              : 'p-1',

          menu: () => 'border rounded bg-black'
        }}
        placeholder="...Search Images"
        isClearable={true}
        isSearchable={true}
        name="color"
        options={tags}
        onChange={(tag: any) => setTag(tag ? tag.value : '')}
        unstyled
      />
    </>
  );
};
