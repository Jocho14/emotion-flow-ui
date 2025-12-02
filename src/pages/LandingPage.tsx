import FloatingLines from "@/components/FloatingLines";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Upload } from "iconoir-react";
import { Link } from "react-router";

const LandingPage: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative flex justify-center items-center">
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 0,
        }}
      >
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[15, 3, 15]}
          lineDistance={100}
          bendRadius={3.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <div className="relative z-1 flex flex-col">
        <div className="flex-1 max-w-2xl">
          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-balance leading-tight">
              <span className="text-foreground text-white">Emotion </span>
              <span className="bg-gradient-to-r from-blue via-pink to-white bg-clip-text text-transparent">
                Flow
              </span>
            </h1>

            {/* Short description */}
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium  text-white">
              <TextGenerateEffect words="Visualize how emotions evolve over time." />
            </p>

            {/* Main paragraph */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg text-white">
              Turn raw actor performance data into intuitive, flowing emotion
              graphs powered by AI.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-lg font-semibold group w-50 h-15"
              >
                <Link to="/analyze">Upload video</Link>
                <Upload className="size-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
