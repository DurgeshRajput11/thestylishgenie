import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

export const HeroSection = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-background via-muted to-background">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Personal Stylist</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
                Stylish Genie
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover your perfect colors and style. Upload your photo for personalized fashion recommendations tailored to your unique skin tone and preferences.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Skin Tone Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Color Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>Outfit Suggestions</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-luxury border border-border/50">
              <img 
                src={heroImage} 
                alt="Fashion styling showcase" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
