"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
  
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB.");
      return;
    }
  
    const uploadUrlResponse = await fetch("/api/getUploadUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    });
  
    const { uploadUrl, key } = await uploadUrlResponse.json();
  
    try {
      
   
    const uploadS3Response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    console.log(`Uploaded key:, ${key} to S3 and response:`, uploadS3Response);
    } catch (error) {
      alert("Error uploading file to S3.");
      console.error("Error uploading file to S3:", error);
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadComplete(false);
      setProgress(0);

      handleFileUpload(selectedFile);
    }
  }

  const simulateUpload = () => {
    if (!file) return

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          return 100
        }
        return prevProgress + 5
      })
    }, 200)
  }

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadImage = () => {
    if (preview) {
      const a = document.createElement("a");
      a.href = preview
      a.download = file?.name || "downloaded-image"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">File Uploader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" ref={fileInputRef} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={preview || ""} alt="Preview" className="object-contain w-full h-full" />
              {!uploading && !uploadComplete && (
                <Button size="icon" variant="destructive" className="absolute top-2 right-2" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{uploadComplete ? "Upload complete" : uploading ? "Uploading..." : "Ready to upload"}</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        {file && !uploadComplete && (
          <Button onClick={simulateUpload} disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        )}

        {uploadComplete && (
          <Button onClick={downloadImage} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
