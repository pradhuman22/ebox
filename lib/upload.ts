'use server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import fs from 'fs';
import config from './config';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
});

export async function uploadImageToCloudinaryAction(folderName: string, formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file uploaded' };
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const tempFilePath = path.join(os.tmpdir(), file.name);
  await writeFile(tempFilePath, buffer);
  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'image',
      folder: folderName,
    });
    fs.unlinkSync(tempFilePath);

    return {
      success: true,
      message: 'Upload Successfully',
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Upload failed' };
  }
}

export async function deleteImageFromCloudinaryAction(url: string) {
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) {
    return null;
  }
  let startIndex = uploadIndex + 1;
  if (parts[startIndex] && parts[startIndex].startsWith('v')) {
    startIndex++;
  }
  const publicIdParts = parts.slice(startIndex);
  const lastPart = publicIdParts[publicIdParts.length - 1];
  const dotIndex = lastPart.lastIndexOf('.');
  if (dotIndex !== -1) {
    publicIdParts[publicIdParts.length - 1] = lastPart.substring(0, dotIndex);
  }
  const publicId = publicIdParts.join('/');
  try {
    const data = await cloudinary.uploader.destroy(publicId);
    if (data.result == 'ok') {
      return { succes: true, message: 'Deleted Successfully' };
    } else {
      return { succes: false, message: 'Failed to delete image' };
    }
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    return { success: false, error: 'Failed to delete image.' };
  }
}
