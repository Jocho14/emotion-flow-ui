import { supabase } from "@/lib/supabaseClient";

import { apiClient } from "./api";

export interface UploadMovieResponse {
  status: string;
  video_id: string;
  final_title: string;
}

export interface UploadToBucketResult {
  storagePath: string;
  publicUrl: string | null;
}

const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET ?? "";

if (!SUPABASE_BUCKET) {
  throw new Error(
    "Supabase bucket is not configured. Please set VITE_SUPABASE_BUCKET."
  );
}

const generateObjectPath = (file: File) => {
  const extension = file.name.split(".").pop();
  const safeExtension = extension ? `.${extension}` : "";
  const randomId =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `uploads/${new Date()
    .toISOString()
    .slice(0, 10)}/${randomId}${safeExtension}`;
};

export const uploadVideoToBucket = async (
  file: File,
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<UploadToBucketResult> => {
  const emitProgress = (loaded: number) => {
    onUploadProgress?.({ loaded, total: file.size });
  };

  emitProgress(0);

  const objectPath = generateObjectPath(file);
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  emitProgress(file.size);

  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(objectPath);

  return {
    storagePath: data.path,
    publicUrl: publicUrlData.publicUrl ?? null,
  };
};

export const postMovie = async (
  storagePath: string,
  originalFilename: string,
  publicUrl?: string | null
): Promise<UploadMovieResponse> => {
  const { data } = await apiClient.post(`/movie`, {
    filePath: storagePath,
    originalFilename,
    publicUrl,
  });

  return data as UploadMovieResponse;
};

export const uploadVideo = async (
  file: File,
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<UploadMovieResponse> => {
  const { storagePath, publicUrl } = await uploadVideoToBucket(
    file,
    onUploadProgress
  );

  return postMovie(storagePath, file.name, publicUrl);
};
