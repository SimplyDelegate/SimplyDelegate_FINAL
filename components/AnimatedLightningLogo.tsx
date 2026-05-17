"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type AnimatedLightningLogoProps = {
  variant?: "navbar" | "hero";
  size?: number;
  className?: string;
  animated?: boolean;
};

const BOLT_PATH =
  "M34.72 2.8c.94 0 1.52 1.02 1.08 1.86L26.92 22.2h17.91c1.12 0 1.65 1.37.83 2.14L22.35 61.2c-.75 1.17-2.57.5-2.38-.88l3.43-24.64H8.63c-1.08 0-1.65-1.28-.93-2.09L34.72 2.8Z";

const FACET_PATH =
  "M34.3 5.7 24.8 24.4h12.9L24.9 45.8l1.85-13.2H13.8L34.3 5.7Z";

const EDGE_PATH =
  "M26.92 22.2h17.91c1.12 0 1.65 1.37.83 2.14L22.35 61.2c-.75 1.17-2.57.5-2.38-.88l1.08-7.75L35.4 27.95H24.04l2.88-5.75Z";

const variantDefaults = {
  navbar: {
    size: 34,
    glowOpacity: 0.28,
    glowScale: 1.08,
    shimmerDuration: 4.8,
    idleDuration: 5.2,
  },
  hero: {
    size: 220,
    glowOpacity: 0.34,
    glowScale: 1.16,
    shimmerDuration: 6.8,
    idleDuration: 7.2,
  },
} as const;

export function AnimatedLightningLogo({
  variant = "navbar",
  size,
  className,
  animated = true,
}: AnimatedLightningLogoProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;
  const settings = variantDefaults[variant];
  const resolvedSize = size ?? settings.size;
  const rawId = useId().replace(/:/g, "");

  const coreGradientId = `${rawId}-lightning-core`;
  const glowGradientId = `${rawId}-lightning-glow`;
  const highlightGradientId = `${rawId}-lightning-highlight`;
  const shimmerGradientId = `${rawId}-lightning-shimmer`;
  const glowFilterId = `${rawId}-lightning-filter`;
  const clipId = `${rawId}-lightning-clip`;

  return (
    <motion.svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={resolvedSize}
      initial={
        shouldAnimate
          ? {
              opacity: 0.86,
              rotate: variant === "navbar" ? -3 : -2,
              scale: variant === "navbar" ? 0.88 : 0.96,
            }
          : false
      }
      animate={
        shouldAnimate
          ? {
              opacity: 1,
              rotate: 0,
              scale:
                variant === "hero"
                  ? [1, 0.985, 1.018, 1]
                  : [1, 1.018, 1],
            }
          : undefined
      }
      transition={
        shouldAnimate
          ? {
              duration: variant === "hero" ? settings.idleDuration : 1,
              ease: [0.22, 1, 0.36, 1],
              repeat: variant === "hero" ? Infinity : 0,
              repeatType: "loop",
            }
          : undefined
      }
      viewBox="0 0 64 64"
      whileHover={
        shouldAnimate
          ? {
              scale: variant === "hero" ? 1.025 : 1.08,
              transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      width={resolvedSize}
    >
      <defs>
        <linearGradient id={coreGradientId} x1="10" x2="48" y1="8" y2="58">
          <stop offset="0" stopColor="#A855FF" />
          <stop offset="0.42" stopColor="#7B2FFF" />
          <stop offset="0.72" stopColor="#3F6BFF" />
          <stop offset="1" stopColor="#36C5FF" />
        </linearGradient>

        <radialGradient id={glowGradientId} cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#8B5CFF" stopOpacity="0.86" />
          <stop offset="0.48" stopColor="#4F7BFF" stopOpacity="0.38" />
          <stop offset="1" stopColor="#36C5FF" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id={highlightGradientId}
          x1="18"
          x2="39"
          y1="7"
          y2="42"
        >
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="0.45" stopColor="#D8C9FF" stopOpacity="0.34" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={shimmerGradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.48" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <filter
          id={glowFilterId}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="92"
          width="92"
          x="-14"
          y="-14"
        >
          <feGaussianBlur
            in="SourceGraphic"
            result="blur"
            stdDeviation={variant === "hero" ? "4" : "2.4"}
          />
          <feColorMatrix
            in="blur"
            result="boost"
            type="matrix"
            values="1 0 0 0 0.18 0 1 0 0 0.08 0 0 1 0 0.42 0 0 0 0.82 0"
          />
          <feMerge>
            <feMergeNode in="boost" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id={clipId}>
          <path d={BOLT_PATH} />
        </clipPath>
      </defs>

      <motion.path
        d={BOLT_PATH}
        fill={`url(#${glowGradientId})`}
        filter={`url(#${glowFilterId})`}
        opacity={shouldAnimate ? settings.glowOpacity : settings.glowOpacity * 0.64}
        style={{ transformOrigin: "50% 50%" }}
        animate={
          shouldAnimate
            ? {
                opacity: [
                  settings.glowOpacity * 0.62,
                  settings.glowOpacity,
                  settings.glowOpacity * 0.7,
                ],
                scale: [1, settings.glowScale, 1],
              }
            : undefined
        }
        transition={
          shouldAnimate
            ? {
                duration: settings.idleDuration,
                ease: "easeInOut",
                repeat: Infinity,
              }
            : undefined
        }
      />

      <path d={BOLT_PATH} fill="#1B0F46" opacity="0.18" transform="translate(1.8 2)" />
      <path d={BOLT_PATH} fill={`url(#${coreGradientId})`} />
      <path d={EDGE_PATH} fill="#163BFF" opacity="0.2" />
      <path d={FACET_PATH} fill={`url(#${highlightGradientId})`} opacity="0.5" />

      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          fill={`url(#${shimmerGradientId})`}
          height="82"
          opacity="0"
          transform="rotate(18 32 32)"
          width="16"
          x="-28"
          y="-8"
          animate={
            shouldAnimate
              ? {
                  opacity: [0, variant === "hero" ? 0.34 : 0.22, 0],
                  x: [-32, 72],
                }
              : undefined
          }
          transition={
            shouldAnimate
              ? {
                  delay: variant === "navbar" ? 0.38 : 0.6,
                  duration: settings.shimmerDuration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: variant === "navbar" ? 1.2 : 0.8,
                }
              : undefined
          }
        />
      </g>

      <path
        d={BOLT_PATH}
        opacity="0.34"
        stroke="#F6F1FF"
        strokeLinejoin="round"
        strokeWidth="0.9"
      />
    </motion.svg>
  );
}
