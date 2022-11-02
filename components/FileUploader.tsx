import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';

export default function Avatar() {
  const supabase = useSupabaseClient<any>();
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  //   useEffect(() => {
  //     if (url) downloadImage(url);
  //   }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  const uploadImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];

      let { error: uploadError } = await supabase.storage
        .from('paid-images')
        .upload(file.name, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      //   onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
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
      setImagePreview(dataurl);
    } catch (error) {
      alert('Error reading image!');
      console.log(error);
    }
  };

  return (
    <div>
      {imagePreview ? (
        <div className="relative w-96 h-96">
          <Image
            src={imagePreview}
            alt="Avatar"
            layout="fill"
            objectFit="contain"
          />
        </div>
      ) : (
        <div className="avatar no-image">No Image Uploaded</div>
      )}
      <div>
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
    </div>
  );
}
