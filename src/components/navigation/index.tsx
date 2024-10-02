import React, { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "/public/logos/daybreak-icon.svg";
import Wordmark from "/public/logos/daybreak-wordmark.svg";

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
        [
          ".wordmark",
          { x: 0, opacity: 1, marginTop: "1px", color: "" },
          { duration: 1, at: "<", ease: "easeInOut" },
        ],
      ]);
      await animate([
        [
          ".logo_container",
          {
            width: "6rem",
          },
          { duration: 1.5, at: "0", ease: "easeInOut" },
        ],
        [
          scope.current,
          { transform: "0" },
          { duration: 1.5, ease: "easeInOut", at: "<" },
        ],
      ]);

      await animate([
        [
          ".items",
          { width: "auto", opacity: 1 },
          { duration: 1, ease: "easeInOut" },
        ],
        [
          ".container",
          { backgroundColor: "rgb(255,255,255,0.5)" },
          { duration: 0.5, ease: "easeInOut", at: "<" },
        ],
      ]);
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
        className="container relative mt-4 flex w-fit items-center justify-center space-x-8 rounded-xl px-6 py-4"
        initial={{ opacity: 0, backgroundColor: "rgb(255,255,255,0)" }}
      >
        <motion.div
          className="logo_container align-center relative flex rounded-xl"
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
              <Logo className="h-full w-full fill-current text-zinc-700" />
            </motion.div>
          </motion.div>

          <motion.div
            className="wordmark_container overflow-hidden pl-[6%] pt-[1%]"
            initial={{ width: "75%" }}
          >
            <motion.div
              className="wordmark h-full w-full"
              initial={{
                x: "100%",
                opacity: 0,
              }}
            >
              <Wordmark className="h-full w-full fill-current text-zinc-700" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="items space-x-8"
          initial={{ opacity: 0, width: "0" }}
        >
          <Link href="/services" className="text-sm text-zinc-500">
            Services
          </Link>
          <Link href="/work" className="text-sm text-zinc-500">
            Work
          </Link>
          <Link href="/about" className="text-sm text-zinc-500">
            About
          </Link>
          <Link href="/contact" className="text-sm text-zinc-500">
            Contact
          </Link>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
