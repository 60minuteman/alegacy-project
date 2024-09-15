"use client";

import RetroGrid from "@/components/RetroGrid";

export function RetroGridDemo() {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-primary via-secondary to-primary bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
       
      </span>
      <RetroGrid />
    </div>
  );
}
