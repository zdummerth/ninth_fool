import React from 'react';

import Select from 'react-select';
const colourOptions = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630' },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

export default () => {
  return (
    <>
      <Select
        className="w-full text-white border rounded"
        classNames={{
          // singleValue: () => 'outline-none px-1',
          // container: () => 'px-1',
          // valueContainer: () => 'outline-none',
          // indicatorsContainer: () => 'bg-black',
          // placeholder: () => 'text-white',
          control: () => 'px-1',
          option: ({ isFocused, isSelected }) =>
            isSelected
              ? 'bg-emerald-800 p-1'
              : isFocused
              ? 'bg-slate-900 p-1'
              : 'p-1',

          menu: () => 'border rounded bg-black'
        }}
        // classNamePrefix="select"
        defaultValue={colourOptions[0]}
        // isDisabled={isDisabled}
        // isLoading={isLoading}
        isClearable={true}
        // isRtl={isRtl}
        isSearchable={true}
        name="color"
        options={colourOptions}
        onChange={(props) => {
          console.log(props);
        }}
        unstyled
      />
    </>
  );
};
