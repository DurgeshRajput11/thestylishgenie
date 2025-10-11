import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleChat } from "@/components/StyleChat";
import { ColorPalette } from "@/components/ColorPalette";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setAnalyzing(true);
    
    const analysisPrompt = "Please analyze this image to determine the person's skin tone (depth and undertone), then provide: 1) Specific color recommendations with HEX codes, 2) Colors to embrace, 3) Colors to avoid, 4) Outfit suggestions for casual, formal, and party occasions. Be detailed and encouraging.";
    
    setMessages([{ role: "user", content: analysisPrompt }]);
    // The StyleChat component will handle the actual API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <ImageUpload 
              onImageUpload={handleImageUpload}
              currentImage={uploadedImage}
            />
            
            {uploadedImage && (
              <ColorPalette />
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:sticky lg:top-6 h-fit">
            <StyleChat 
              messages={messages}
              setMessages={setMessages}
              uploadedImage={uploadedImage}
              analyzing={analyzing}
              setAnalyzing={setAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
