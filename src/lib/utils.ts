import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/integrations/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Avatar upload utilities
export const AVATAR_STORAGE_BUCKET = 'avatars';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a valid image file (JPEG, PNG, or WebP)' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
};

export const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Validate the file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName; // Just use filename since bucket is already 'avatars'

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(AVATAR_STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload image. Please try again.' };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(AVATAR_STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'An unexpected error occurred while uploading.' };
  }
};

export const deleteAvatar = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(AVATAR_STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

export const getAvatarPath = (url: string): string => {
  // Extract the file path from a Supabase storage URL
  // For URLs like: https://[project].supabase.co/storage/v1/object/public/avatars/filename.jpg
  const parts = url.split('/');
  const avatarsIndex = parts.findIndex(part => part === 'avatars');
  if (avatarsIndex !== -1 && avatarsIndex + 1 < parts.length) {
    return parts[avatarsIndex + 1]; // Return just the filename
  }
  return '';
};
