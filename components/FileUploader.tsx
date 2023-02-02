import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

export default function FileUploader() {
  const supabase = useSupabaseClient<any>();
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { handleSubmit, register } = useForm();

  const uploadImage: any = async (data: any) => {
    try {
      setUploading(true);

      let { error: uploadError } = await supabase.storage
        .from('paid-images')
        .upload(image.name, image.file, { upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { error } = await supabase.from('paid-images').insert({
        filepath: image.name,
        width: image.width,
        height: image.height,
        tagstring: data.tagstring,
        downloads: 0
      });

      if (error) {
        throw error;
      }

      setImage(null);
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const dataurl = URL.createObjectURL(file);
      var img: HTMLImageElement;
      img = document.createElement('img');

      img.onload = function () {
        setImage({
          width: img.naturalWidth,
          height: img.naturalHeight,
          src: dataurl,
          name: file.name,
          file
        });
      };

      img.src = dataurl;
    } catch (error) {
      alert('Error reading image!');
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center border">
      <div className="mb-8">
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Choose Image'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute'
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={onImageChange}
          disabled={uploading}
        />
      </div>
      {image?.src ? (
        <>
          <div className="relative w-96 h-96 border rounded">
            <Image
              src={image.src}
              alt="Avatar"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div>
            <span className="mr-4">
              <span className="mr-2">Height:</span>
              <span>{image.height}</span>
            </span>
            <span>
              <span className="mr-2">Width:</span>
              <span>{image.width}</span>
            </span>
          </div>
          <form className="my-4 w-full" onSubmit={handleSubmit(uploadImage)}>
            <label htmlFor="tagstring">Seperate tags by comma</label>
            <div className="flex">
              <input
                className="bg-zinc-700 p-2 rounded mr-2 flex-1"
                placeholder=""
                {...register('tagstring', { required: true })}
              />
              <button className="p-1 rounded border" disabled={uploading}>
                {uploading ? 'Uploading ...' : 'Submit'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="avatar no-image">No Image Uploaded</div>
      )}
    </div>
  );
}
