
import React, { useState, useRef, useEffect } from "react";
import { Upload, Image, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      toast("Files selected", {
        description: `${event.target.files.length} images ready to upload`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      toast("Files dropped", {
        description: `${e.dataTransfer.files.length} images ready to upload`,
      });
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast("No files selected", {
        description: "Please select at least one image file first.",
      });
      return;
    }
    
    setUploading(true);
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
      toast.success("Upload successful", {
        description: "Your images are now being processed.",
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Upload failed", {
        description: "There was an error uploading your files.",
      });
    }
    setUploading(false);
    setLoading(false);
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/results/");
      const data = await response.json();
      setResults(data);
      toast.success("Results loaded", {
        description: "Face clustering results have been fetched successfully.",
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Error loading results", {
        description: "There was an error fetching the clustering results.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Image lazy loading with blur animation
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  const handleImageLoad = (imgKey: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imgKey]: true
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900 px-6 py-16 sm:px-10 md:px-20 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Add theme toggle button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="mb-2 inline-block rounded-full bg-[#0071e3]/10 dark:bg-[#0071e3]/20 px-3 py-1 text-xs font-medium text-[#0071e3] dark:text-[#3694ff]">
            Face Recognition
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white sm:text-5xl md:text-6xl">
            Face Clustering
          </h1>
          <p className="mx-auto max-w-2xl text-[#86868b] dark:text-gray-400">
            Upload your images and let our advanced algorithm identify and group similar faces
          </p>
        </div>

        {/* Upload Section */}
        <div 
          className={cn(
            "mb-12 cursor-pointer rounded-2xl border-2 border-dashed border-[#d2d2d7] dark:border-gray-700 bg-white dark:bg-gray-800 p-8 transition-all duration-300",
            dragActive ? "border-[#0071e3] dark:border-[#3694ff] bg-[#0071e3]/5 dark:bg-[#3694ff]/10" : "hover:border-[#0071e3]/50 dark:hover:border-[#3694ff]/50 hover:bg-[#0071e3]/[0.02] dark:hover:bg-[#3694ff]/[0.05]"
          )}
          onClick={openFileDialog}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0071e3]/10 dark:bg-[#3694ff]/20">
              <Upload size={24} className="text-[#0071e3] dark:text-[#3694ff]" />
            </div>
            <h2 className="mb-2 text-xl font-medium text-[#1d1d1f] dark:text-white">
              {files && files.length > 0 
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected` 
                : "Drop your images here"}
            </h2>
            <p className="mb-4 text-sm text-[#86868b] dark:text-gray-400">
              {files && files.length > 0 
                ? "Click to change selection" 
                : "Or click to browse files from your computer"}
            </p>
            
            {files && files.length > 0 && (
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] dark:bg-[#3694ff] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#0077ED] dark:hover:bg-[#4ba0ff] active:bg-[#0068d0] dark:active:bg-[#2b7fd4] disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Upload Images
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Clustering Results</h2>
          <button
            onClick={fetchResults}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2 text-sm font-medium text-[#1d1d1f] dark:text-white transition-all hover:bg-[#f5f5f7] dark:hover:bg-gray-700 active:bg-[#e8e8ed] dark:active:bg-gray-600 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh Results
          </button>
        </div>

        {Object.keys(results).length === 0 ? (
          <div className="rounded-2xl border border-[#d2d2d7] dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
            <Image size={32} className="mx-auto mb-4 text-[#86868b] dark:text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-[#1d1d1f] dark:text-white">No results yet</h3>
            <p className="text-[#86868b] dark:text-gray-400">
              Upload your images and process them to see the clustering results
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(results).map(([key, images]) => (
              <div 
                key={key} 
                className="overflow-hidden rounded-2xl border border-[#d2d2d7] dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-md"
              >
                <div className="border-b border-[#d2d2d7] dark:border-gray-700 bg-[#f5f5f7] dark:bg-gray-700 px-6 py-4">
                  <h3 className="font-medium text-[#1d1d1f] dark:text-white">Cluster {key}</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative overflow-hidden rounded-md">
                      <div 
                        className={cn(
                          "absolute inset-0 bg-[#f5f5f7] dark:bg-gray-700",
                          loadedImages[`${key}-${index}`] ? "opacity-0" : "opacity-100"
                        )} 
                        style={{ transition: "opacity 0.3s ease-in-out" }}
                      />
                      <img 
                        src={`http://localhost:8000${img}`} 
                        alt={`Cluster ${key}`} 
                        width={80} 
                        height={80}
                        className="aspect-square h-20 w-20 rounded-md object-cover"
                        onLoad={() => handleImageLoad(`${key}-${index}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
