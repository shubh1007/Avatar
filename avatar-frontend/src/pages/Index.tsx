
import { useState } from "react";
import { Upload, Image as ImageIcon, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Intelligent Face Recognition
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Group faces with
            <br />
            artificial intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our advanced deep learning system automatically organizes your photos by recognizing and grouping similar faces.
          </p>
          
          {/* Upload Area */}
          <div 
            className={`
              mt-12 max-w-md mx-auto p-8 rounded-2xl transition-all duration-300
              ${isHovered 
                ? 'bg-card shadow-lg transform scale-[1.02]' 
                : 'bg-muted shadow-md'
              }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your images here, or{" "}
                <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                  browse
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-muted animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Batch Processing</h3>
              <p className="text-muted-foreground">
                Upload multiple images at once and let our AI process them efficiently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-muted animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Clustering</h3>
              <p className="text-muted-foreground">
                Advanced algorithms automatically group similar faces together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-muted animate-fade-in" style={{animationDelay: "0.3s"}}>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Easy Export</h3>
              <p className="text-muted-foreground">
                Download your organized photos in a structured format.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
