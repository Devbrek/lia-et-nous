import Hero from "@/components/lia-et-nous/Hero";
import Mechanism from "@/components/lia-et-nous/Mechanism";
import FiguresGrid from "@/components/lia-et-nous/FiguresGrid";
import WorldScale from "@/components/lia-et-nous/WorldScale";
import ModelSize from "@/components/lia-et-nous/ModelSize";
import Practice from "@/components/lia-et-nous/Practice";
import Closing from "@/components/lia-et-nous/Closing";
import Sources from "@/components/lia-et-nous/Sources";
import About from "@/components/lia-et-nous/About";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <Mechanism />
      <FiguresGrid />
      <WorldScale />
      <ModelSize />
      <Practice />
      <Closing />
      <About />
      <Sources />
    </div>
  );
}
