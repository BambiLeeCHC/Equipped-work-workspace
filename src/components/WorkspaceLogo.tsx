import { useEffect, useState } from "react";

/**
 * Chromatic E-Quipped brand logos
 * Matches the official marketing logos — chromatic fuchsia→violet→cyan gradient E
 * with clean dark text on light backgrounds.
 */

/* Chromatic color cycle for animated versions */
const CHROMATIC_CYCLE = [
  { e: "#d946ef", mid: "#8b5cf6", end: "#06b6d4" },  // fuchsia → violet → cyan
  { e: "#a855f7", mid: "#6366f1", end: "#3b82f6" },  // purple → indigo → blue
  { e: "#ec4899", mid: "#d946ef", end: "#8b5cf6" },  // pink → fuchsia → violet
  { e: "#8b5cf6", mid: "#3b82f6", end: "#06b6d4" },  // violet → blue → cyan
  { e: "#f43f5e", mid: "#d946ef", end: "#6366f1" },  // rose → fuchsia → indigo
];

/**
 * Full "E-Quipped: Work[Space]" animated logo
 */
export function WorkspaceLogo({
  size = "lg",
  animate = true,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  animate?: boolean;
}) {
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setColorIdx((prev) => (prev + 1) % CHROMATIC_CYCLE.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [animate]);

  const palette = animate ? CHROMATIC_CYCLE[colorIdx] : CHROMATIC_CYCLE[0];

  const styles = {
    xs: {
      wrapper: "gap-0.5",
      eSize: "text-sm",
      mainText: "text-sm font-extrabold",
      workText: "text-sm font-extrabold ml-0.5",
      rect: "text-[10px] font-extrabold px-1.5 py-[1px] ml-0.5 rounded-[3px]",
    },
    sm: {
      wrapper: "gap-0.5",
      eSize: "text-base",
      mainText: "text-base font-extrabold",
      workText: "text-base font-extrabold ml-0.5",
      rect: "text-[12px] font-extrabold px-2 py-[2px] ml-0.5 rounded-[3px]",
    },
    md: {
      wrapper: "gap-0",
      eSize: "text-2xl",
      mainText: "text-2xl font-extrabold",
      workText: "text-2xl font-extrabold ml-1",
      rect: "text-[16px] font-extrabold px-2.5 py-[3px] ml-1 rounded-[4px]",
    },
    lg: {
      wrapper: "gap-0",
      eSize: "text-4xl",
      mainText: "text-4xl font-extrabold",
      workText: "text-4xl font-extrabold ml-1.5",
      rect: "text-[22px] font-extrabold px-3 py-[4px] ml-1.5 rounded-[4px]",
    },
  }[size];

  return (
    <span className={`inline-flex items-center ${styles.wrapper} select-none leading-none`}>
      {/* Chromatic E */}
      <span
        className={`${styles.eSize} font-extrabold transition-all duration-700`}
        style={{
          background: `linear-gradient(180deg, ${palette.e}, ${palette.mid}, ${palette.end})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 8px ${palette.e}50)`,
        }}
      >
        E
      </span>
      <span className={styles.mainText}>
        <span className="text-gray-200">-Quipped:</span>
      </span>

      {/* Work */}
      <span className={`${styles.workText} text-white`}>
        Work
      </span>

      {/* [Space] badge — chromatic gradient fill */}
      <span
        className={`${styles.rect} text-white transition-all duration-700 inline-flex items-center`}
        style={{
          background: `linear-gradient(135deg, ${palette.e}, ${palette.mid}, ${palette.end})`,
          boxShadow: `0 0 12px ${palette.mid}40, 0 2px 8px ${palette.end}30`,
        }}
      >
        Space
      </span>
    </span>
  );
}

/**
 * Inline brand mark for nav bars
 * "E-Quipped: Work" with chromatic gradient E matching official logos
 */
export function BrandMark({
  variant = "course",
}: {
  variant?: "course" | "workspace";
}) {
  if (variant === "workspace") {
    return <WorkspaceLogo size="xs" animate={true} />;
  }

  return (
    <span className="font-extrabold text-lg tracking-tight inline-flex items-center">
      <span
        style={{
          background: "linear-gradient(180deg, #d946ef, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 6px rgba(217,70,239,0.3))",
        }}
      >
        E
      </span>
      <span className="text-gray-300">-Quipped:</span>{" "}
      <span className="text-white ml-0.5">Work</span>
    </span>
  );
}
