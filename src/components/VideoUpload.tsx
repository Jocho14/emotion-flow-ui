import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, VideoCamera } from "iconoir-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
  onAnalyze?: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onFileSelect,
  onAnalyze,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("video/")) {
          setSelectedFile(file);
          onFileSelect(file);
        } else {
          alert("Please upload a video file");
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("video/")) {
          setSelectedFile(file);
          onFileSelect(file);
        } else {
          alert("Please upload a video file");
        }
      }
    },
    [onFileSelect]
  );

  const handleButtonClick = () => {
    const input = document.getElementById("file-input") as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/5",
          selectedFile && "border-primary bg-primary/5"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <div
            className={cn(
              "rounded-full p-6 transition-colors",
              isDragging ? "bg-primary/20" : "bg-muted/50"
            )}
          >
            {selectedFile ? (
              <VideoCamera className="size-12 text-primary" />
            ) : (
              <Upload className="size-12 text-muted-foreground" />
            )}
          </div>

          {selectedFile ? (
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {isDragging ? "Drop your video here" : "Drag & drop your video"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click the button below to browse
              </p>
            </div>
          )}

          <input
            id="file-input"
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <Button
            onClick={handleButtonClick}
            size="lg"
            className="mt-2"
            variant={selectedFile ? "secondary" : "default"}
            disabled={isUploading}
          >
            {selectedFile ? "Change Video" : "Browse Files"}
            <Upload className="size-5" />
          </Button>

          {selectedFile && (
            <Button
              onClick={() => {
                if (onAnalyze && selectedFile) {
                  onAnalyze(selectedFile);
                }
              }}
              size="lg"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                </>
              ) : (
                <>
                  Analyze Video
                  <VideoCamera className="size-5" />
                </>
              )}
            </Button>
          )}

          {isUploading && uploadProgress > 0 && (
            <div className="w-full">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Supported formats:</h3>
          <p className="text-sm text-muted-foreground">
            MP4, MOV, AVI, WebM, and other common video formats
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
