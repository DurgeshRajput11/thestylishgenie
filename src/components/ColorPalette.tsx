import { Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ColorPalette = () => {
  const recommendedColors = [
    { name: "Olive Green", hex: "#556B2F" },
    { name: "Mustard", hex: "#FFDB58" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Coral", hex: "#FF7F50" },
    { name: "Maroon", hex: "#800000" },
  ];

  const avoidColors = [
    { name: "Neon Pink", hex: "#FF10F0" },
    { name: "Icy Blue", hex: "#99FFFF" },
    { name: "Pure White", hex: "#FFFFFF" },
  ];

  return (
    <Card className="p-6 shadow-luxury bg-gradient-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Color Recommendations</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">Colors to Embrace</h4>
          <div className="grid grid-cols-5 gap-3">
            {recommendedColors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div
                  className="w-full aspect-square rounded-lg border-2 border-border shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs text-center text-muted-foreground truncate">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">Colors to Avoid</h4>
          <div className="grid grid-cols-3 gap-3">
            {avoidColors.map((color) => (
              <div key={color.name} className="space-y-2 opacity-60">
                <div
                  className="w-full aspect-square rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs text-center text-muted-foreground truncate">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center italic">
        These are example colors. Upload your photo for personalized recommendations!
      </p>
    </Card>
  );
};
