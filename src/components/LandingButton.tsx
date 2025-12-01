import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { MagicWand } from "iconoir-react";

const LandingButton: React.FC = () => {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="bg-black text-white flex items-center space-x-2"
      >
        <MagicWand />
        <span>Get started</span>
      </HoverBorderGradient>
    </div>
  );
};
export default LandingButton;
