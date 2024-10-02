import React, { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      await animate(
        ".container",
        { opacity: 1 },
        { duration: 1, ease: "easeInOut" },
      );
      await animate(
        ".glyph",
        { rotate: 0 },
        { duration: 1, ease: "easeInOut" },
      );
      await animate([
        [".glyph_container", { x: "0%" }, { duration: 1, ease: "easeInOut" }],
        [".wordmark", { x: 0 }, { duration: 1, at: "<", ease: "easeInOut" }],
      ]);
      await animate([
        [
          ".logo_container",
          {
            width: "8rem",
          },
          { duration: 2, at: "0", ease: "easeInOut" },
        ],
        [scope.current, { transform: "0" }, { duration: 1, ease: "easeInOut" }],
      ]);
      // await animate(
      //   ".items",
      //   { width: "100%", opacity: 1 },
      //   { duration: 1, ease: "easeInOut" },
      // );
    };

    sequence();
  }, [animate, scope]);

  return (
    <motion.nav
      className="fixed z-50 mx-auto flex h-fit w-full items-center justify-center"
      initial={{ transform: "translateY(50vh)" }}
      ref={scope}
    >
      <motion.div
        className="container relative flex w-fit items-center justify-center p-4"
        initial={{ opacity: 0 }}
      >
        <motion.div
          className="logo_container align-center relative flex rounded-xl p-4"
          initial={{ width: "16rem", height: "auto" }}
        >
          <motion.div
            className="glyph_container h-fit overflow-hidden"
            initial={{
              width: "25%",
              x: "200%",
            }}
          >
            <motion.div
              className="glyph h-full w-full origin-bottom"
              initial={{ rotate: 180 }}
            >
              <Image
                className="h-full w-full"
                src="./logos/daybreak-icon.svg"
                alt="Daybreak"
                width={32}
                height={32}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="wordmark_container overflow-hidden pl-[4%] pt-[1%]"
            initial={{ width: "75%" }}
          >
            <motion.div
              className="wordmark h-full w-full"
              initial={{
                x: "100%",
              }}
            >
              <Image
                className="h-full w-full"
                src="./logos/daybreak-wordmark.svg"
                alt="Daybreak"
                width={128}
                height={64}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="items ml-auto space-x-4"
          initial={{ opacity: 0, width: "0" }}
        >
          <Link href="/services">Services</Link>
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
