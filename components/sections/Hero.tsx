import Image from "next/image";
import { CircleChevronRight } from "lucide-react";

export default function Hero() {
  return(
    <div className="px-24 h-110 bg-secondary-light rounded-4xl shadow-lg
      flex flex-row justify-center items-center gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold font-display">
          Take Your Job Hunting To The Next Level
        </h1>
        <h3 className="text-lg font-body">
          Practice mock Interviews and be ahead of your competetion
        </h3>
        <button className="inline-flex items-center gap-1 px-4 py-2 w-fit
          text-sm font-semibold border rounded-4xl
          hover:bg-secondary-dark hover:text-white transition-all duration-400"
        >
          Start Now
          <CircleChevronRight/>
        </button>
      </div>
      <Image src="/hero_bird.svg"
        height={400} 
        width={400}
      />
    </div>
  );
}
