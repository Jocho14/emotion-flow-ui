import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

import EmotionAreaChart from "@/components/EmotionAreaChart";
import EmotionRadarChart from "@/components/EmotionRadarChart";
import VideoUpload from "@/components/VideoUpload";
import { Button } from "@/components/ui/button";

import { getEmotions } from "@/api/emotions";
import { uploadVideo, type UploadMovieResponse } from "@/api/movie";
import type { EmotionsChartData } from "@/types/emotions";

const AnalyzePage: React.FC = () => {
  const [showCharts, setShowCharts] = useState(false);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data, isFetching, isLoading } = useQuery<EmotionsChartData>({
    queryKey: ["emotions", movieId],
    queryFn: () => {
      if (!movieId) {
        throw new Error("movie id is required");
      }

      return getEmotions(movieId);
    },
    enabled: !!movieId,
    refetchOnWindowFocus: false,
  });

  const uploadMutation = useMutation<UploadMovieResponse, Error, File>({
    mutationFn: (file: File) =>
      uploadVideo(file, (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      }),
    onSuccess: (uploadResponse) => {
      console.log("Upload successful, movie ID:", uploadResponse.video_id);
      setMovieId(uploadResponse.video_id);
      setShowCharts(true);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      alert("Failed to upload video. Please try again.");
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file);
  };

  const handleAnalyze = (file: File) => {
    console.log("Analyzing video:", file);
    uploadMutation.mutate(file);
  };

  const handleReset = () => {
    setShowCharts(false);
    setMovieId(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-screen min-h-screen p-8">
      {!showCharts ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold mb-8">Upload Your Video</h1>
          <VideoUpload
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            isUploading={uploadMutation.isPending}
            uploadProgress={uploadProgress}
          />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {data?.movieTitle || "Emotion Flow Overview"}
              </h1>
              <p className="text-muted-foreground">
                Explore the eight-emotion profile generated from your upload.
              </p>
            </div>
            <Button onClick={handleReset} variant="outline">
              Upload New Video
            </Button>
          </div>

          {isLoading || isFetching ? (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Processing your analysis...
            </div>
          ) : (
            <>
              <EmotionAreaChart chartData={data?.area ?? []} />
              <EmotionRadarChart chartData={data?.radar ?? []} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
