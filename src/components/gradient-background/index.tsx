"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const GradientBackground = () => {
  const controls = useAnimationControls();
  const router = useRouter();

  useEffect(() => {
    controls.start({
      y: "-50%",
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        animate={controls}
        className="absolute inset-0 h-[1500%] w-full"
      >
        <div
          className="h-full w-full mix-blend-normal"
          style={{
            background: `linear-gradient(
                0deg,
                rgb(95, 95, 162) 0%,        /* Softer night blue */
                rgb(95, 95, 162) 4%,        /* Extended night */
                rgb(115, 115, 165) 12%,     /* Transitioning to dawn */
                rgb(135, 125, 165) 20%,     /* Pre-dawn purple */
                rgb(155, 135, 165) 28%,     /* Dawn purple-pink */
                rgb(175, 145, 165) 36%,     /* Early sunrise pink */
                rgb(195, 165, 165) 42%,     /* Sunrise pink-orange */
                rgb(215, 185, 170) 46%,     /* Morning golden */
                rgb(220, 190, 180) 48%,     /* Late morning */
                rgb(220, 190, 180) 50%,     /* Peak brightness */
                rgb(220, 190, 180) 52%,     /* Early afternoon */
                rgb(215, 185, 170) 54%,     /* Late afternoon */
                rgb(195, 165, 165) 58%,     /* Early sunset */
                rgb(175, 145, 165) 64%,     /* Sunset pink */
                rgb(155, 135, 165) 72%,     /* Dusk purple-pink */
                rgb(135, 125, 165) 80%,     /* Late dusk purple */
                rgb(115, 115, 165) 88%,     /* Early night */
                rgb(95, 95, 162) 96%,       /* Night blue */
                rgb(95, 95, 162) 100%      /* Deep night - matches start */
              )`,
            backgroundSize: "100% 50%",
            backgroundRepeat: "repeat-y",
          }}
        />
      </motion.div>
      {/* Noise overlay */}
      <div
        className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay"
        style={{ backgroundSize: "200px 200px" }}
      />
    </div>
  );
};
