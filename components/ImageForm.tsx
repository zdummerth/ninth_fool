import React from 'react';
import { useForm } from 'react-hook-form';

interface DefaultValue {
  tagstring: string;
  caption: string;
}
interface Props {
  onSubmit: any;
  defaultValues: DefaultValue;
  loading: boolean;
}

export default function ImageForm({ onSubmit, loading, defaultValues }: Props) {
  const { handleSubmit, register } = useForm({ defaultValues });

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="tagstring" className="block p-2">
          Seperate tags by comma
        </label>
        <input
          className="bg-zinc-700 p-2 rounded mr-2 w-full"
          placeholder=""
          {...register('tagstring', { required: true })}
        />
      </div>
      <div>
        <label htmlFor="caption" className="block p-2">
          Caption
        </label>

        <textarea
          className="bg-zinc-700 p-2 rounded w-full"
          placeholder=""
          {...register('caption', { required: false })}
        />
      </div>
      <button className="py-2 my-4 rounded border w-full" disabled={loading}>
        {loading ? 'Saving ...' : 'Save'}
      </button>
    </form>
  );
}
