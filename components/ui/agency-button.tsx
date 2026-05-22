"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgencyButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: "default" | "animatedDark";
};

export function AgencyButton({
  children,
  href,
  className,
  variant = "default",
}: AgencyButtonProps) {
  const reduceMotion = useReducedMotion();
  const isAnimatedDark = variant === "animatedDark";

  return (
    <motion.div
      className="inline-flex"
      whileHover={reduceMotion ? undefined : isAnimatedDark ? { y: -4 } : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: isAnimatedDark ? 0.975 : 0.985 }}
      transition={{ duration: isAnimatedDark ? 0.32 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Button
        asChild
        className={cn(
          isAnimatedDark
            ? "group relative h-auto min-h-14 max-w-[calc(100vw-2.25rem)] gap-4 overflow-visible whitespace-normal rounded-[8px] border-white/15 bg-[#05060a] px-5 py-2.5 text-center text-[0.95rem] font-semibold leading-[1.15] text-white shadow-[0_18px_42px_rgba(5,6,10,0.24),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-[#0c0e14] hover:shadow-[0_26px_56px_rgba(5,6,10,0.34),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.24)] sm:h-14 sm:max-w-none sm:whitespace-nowrap sm:px-6 sm:py-0 sm:pr-5 sm:leading-none"
            : "group h-12 gap-4 overflow-hidden px-5 text-[0.92rem]",
          className,
        )}
      >
        <a href={href}>
          <span className={isAnimatedDark ? "min-w-0" : undefined}>{children}</span>
          {isAnimatedDark ? (
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center overflow-visible rounded-[7px] border border-white/12 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.14]"
            >
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="relative h-2 w-7 overflow-hidden"
            >
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-current transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </a>
      </Button>
    </motion.div>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}
