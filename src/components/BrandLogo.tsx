/**
 * CSS-rendered brand logos for E-Quipped: Work and E-Quipped: Work Space.
 * Matches the approved chromatic logo designs — works on any background.
 *
 * The "E" is slightly taller than the rest of the text (≈1.3×) and sits
 * flush against "-Quipped" with no visible gap, so it reads as one word.
 */

interface BrandLogoProps {
  variant: "work" | "workspace";
  /** Overall scale */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Light text (dark bg) or dark text (light bg) */
  theme?: "dark" | "light";
  className?: string;
}

/*
 * Each size defines:
 *   eFontSize  – the chromatic "E" in px
 *   textSize   – "-Quipped: Work" in px
 *   pillSize   – "Space" label in px
 *   pillPx/Py  – pill padding
 *   pillRadius – pill border-radius
 *   glowPx     – glow spread on the E
 */
const SIZES: Record<
  string,
  {
    eFontSize: number;
    textSize: number;
    pillSize: number;
    pillPx: number;
    pillPy: number;
    pillRadius: number;
    glowPx: number;
  }
> = {
  xs:  { eFontSize: 20, textSize: 15, pillSize: 10, pillPx: 5, pillPy: 2, pillRadius: 3, glowPx: 4  },
  sm:  { eFontSize: 26, textSize: 20, pillSize: 13, pillPx: 7, pillPy: 2, pillRadius: 4, glowPx: 5  },
  md:  { eFontSize: 38, textSize: 28, pillSize: 16, pillPx: 9, pillPy: 3, pillRadius: 5, glowPx: 6  },
  lg:  { eFontSize: 52, textSize: 40, pillSize: 22, pillPx: 12, pillPy: 4, pillRadius: 6, glowPx: 8  },
  xl:  { eFontSize: 68, textSize: 52, pillSize: 28, pillPx: 14, pillPy: 5, pillRadius: 7, glowPx: 10 },
};

export function BrandLogo({
  variant,
  size = "md",
  theme = "dark",
  className = "",
}: BrandLogoProps) {
  const s = SIZES[size];
  const textColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  return (
    <span
      className={`inline-flex items-center select-none whitespace-nowrap ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* ── Chromatic E ── */}
      <span
        style={{
          fontSize: s.eFontSize,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          background:
            "linear-gradient(180deg, #d946ef 0%, #a855f7 35%, #8b5cf6 55%, #06b6d4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${s.glowPx}px rgba(217,70,239,0.35)) drop-shadow(0 0 ${s.glowPx * 2}px rgba(139,92,246,0.18))`,
          marginRight: "-0.02em",
        } as React.CSSProperties}
      >
        E
      </span>

      {/* ── -Quipped: Work ── */}
      <span
        style={{
          fontSize: s.textSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: textColor,
        }}
      >
        -Quipped: Work
      </span>

      {/* ── Space pill (workspace only) ── */}
      {variant === "workspace" && (
        <span
          style={{
            fontSize: s.pillSize,
            fontWeight: 700,
            lineHeight: 1,
            color: "#ffffff",
            marginLeft: s.pillPx * 0.6,
            padding: `${s.pillPy}px ${s.pillPx}px`,
            borderRadius: s.pillRadius,
            background:
              "linear-gradient(135deg, #d946ef 0%, #a855f7 40%, #06b6d4 100%)",
            boxShadow:
              "0 0 10px rgba(217,70,239,0.25), 0 0 20px rgba(6,182,212,0.12)",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          Space
        </span>
      )}
    </span>
  );
}
