"use client";

import {
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe2,
  Network,
  Sparkles,
} from "lucide-react";

const orbitIcons = [
  { Icon: BrainCircuit, className: "-top-[26.25px] left-1/2 -translate-x-1/2" },
  { Icon: Cloud, className: "-right-[26.25px] top-1/2 -translate-y-1/2" },
  { Icon: Code2, className: "-bottom-[26.25px] left-1/2 -translate-x-1/2" },
  { Icon: Database, className: "-left-[26.25px] top-1/2 -translate-y-1/2" },
];

const innerIcons = [
  { Icon: Cpu, className: "-top-[26.25px] left-1/2 -translate-x-1/2" },
  { Icon: Network, className: "-bottom-[26.25px] left-1/2 -translate-x-1/2" },
  { Icon: Sparkles, className: "-left-[26.25px] top-1/2 -translate-y-1/2" },
];

function OrbitIcon({ Icon, className }: { Icon: typeof Globe2; className: string }) {
  return (
    <span
      className={`absolute flex size-[52.5px] items-center justify-center rounded-full border border-white/20 bg-black/45 text-white/80 shadow-[0_0_24px_rgba(71,8,217,0.55)] backdrop-blur-md ${className}`}
    >
      <Icon className="size-[21px]" strokeWidth={1.5} />
    </span>
  );
}

/** Decorative model/provider orbit layer for the hero. */
export default function OrbitingCirclesGlobe() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
    >
      <div className="relative mt-20 aspect-square w-[min(182.02vw,1602px)] shrink-0 translate-y-[30%] opacity-80 sm:mt-12 sm:w-[min(152.9vw,1602px)]">
        <div className="absolute inset-[7%] rounded-full border border-white/10 [box-shadow:0_0_80px_rgba(71,8,217,0.28),inset_0_0_80px_rgba(71,8,217,0.18)]" />
        <div className="absolute inset-[7%] animate-[spin_34s_linear_infinite] rounded-full border border-dashed border-violet-300/25">
          {orbitIcons.map(({ Icon, className }) => (
            <OrbitIcon key={className} Icon={Icon} className={className} />
          ))}
        </div>

        <div className="absolute inset-[22%] animate-[spin_24s_linear_infinite_reverse] rounded-full border border-white/15">
          {innerIcons.map(({ Icon, className }) => (
            <OrbitIcon key={className} Icon={Icon} className={className} />
          ))}
        </div>
      </div>
    </div>
  );
}
