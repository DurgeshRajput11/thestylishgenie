import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage: string | null;
}

export const ImageUpload = ({ onImageUpload, currentImage }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
      toast({
        title: "Image uploaded",
        description: "Analyzing your skin tone...",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="p-8 border-2 border-dashed transition-all duration-300 hover:shadow-luxury bg-gradient-card">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Upload Your Photo
          </h2>
          <p className="text-muted-foreground">
            Get personalized style recommendations based on your skin tone
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {currentImage ? (
            <div className="space-y-4">
              <img
                src={currentImage}
                alt="Uploaded"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="transition-all hover:scale-105"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Different Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your image here, or
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105"
                >
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
          className="hidden"
        />
      </div>
    </Card>
  );
};
