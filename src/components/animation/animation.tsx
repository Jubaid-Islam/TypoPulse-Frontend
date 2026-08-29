"use client";

export function BackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base grid */}
      <div className="grid-layer" />

      {/* Traveling light beams */}
      <div className="beam beam-1" />
      <div className="beam beam-2" />

      {/* Center glow */}
      <div className="center-glow" />

      {/* Edge fade so grid doesn't look cut off */}
      <div className="edge-fade" />
    </div>
  );
}