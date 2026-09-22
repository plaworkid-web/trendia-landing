"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Bento-style feature grid.
 *
 * Six content slots arranged asymmetrically: one tall card on the left, a two-by-two
 * block beside it, and a wide card across the bottom. The slots are props rather than
 * a data array because each card has its own internal layout — a stat, a checklist, a
 * diagram — which a generic `items[]` prop would flatten into identical boxes.
 *
 * The animation is skipped entirely when the visitor asks for reduced motion: a grid
 * that fades in on scroll is decoration, and `useReducedMotion` is the difference
 * between decoration and an accessibility problem.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

export interface BentoGridShowcaseProps {
  /** Tall card on the left, spanning two rows. */
  tall: React.ReactNode;
  /** Top-left of the 2x2 block. */
  topLeft: React.ReactNode;
  /** Top-right of the 2x2 block. */
  topRight: React.ReactNode;
  /** Bottom-left of the 2x2 block. */
  bottomLeft: React.ReactNode;
  /** Bottom-right of the 2x2 block. */
  bottomRight: React.ReactNode;
  /** Wide card across the bottom, spanning two columns. */
  wide: React.ReactNode;
  className?: string;
}

export function BentoGridShowcase({
  tall,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  wide,
  className,
}: BentoGridShowcaseProps) {
  const reduceMotion = useReducedMotion();

  // `lg:grid-cols-3` with explicit row spans gives the layout without absolute
  // positioning: the tall card occupies rows 1-2 of column 1, the four small cards
  // fill columns 2-3 across those rows, and the wide card takes columns 1-2 of row 3.
  const gridClass = cn(
    "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    className,
  );

  if (reduceMotion) {
    return (
      <div className={gridClass}>
        <div className="sm:row-span-2">{tall}</div>
        {topLeft}
        {topRight}
        {bottomLeft}
        {bottomRight}
        <div className="sm:col-span-2">{wide}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={gridClass}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div variants={itemVariants} className="sm:row-span-2">
        {tall}
      </motion.div>
      {[topLeft, topRight, bottomLeft, bottomRight].map((node, i) => (
        <motion.div key={i} variants={itemVariants}>
          {node}
        </motion.div>
      ))}
      <motion.div variants={itemVariants} className="sm:col-span-2">
        {wide}
      </motion.div>
    </motion.div>
  );
}
