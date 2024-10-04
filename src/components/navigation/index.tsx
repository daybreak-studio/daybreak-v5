import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "/public/logos/daybreak-icon.svg";
import Wordmark from "/public/logos/daybreak-wordmark.svg";

export default function Navigation() {
  const [scope, animate] = useAnimate();
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const runAnimationSequence = async () => {
      if (isHomePage && !hasAnimated) {
        await animate([
          [
            ".container",
            { opacity: 1 },
            { duration: 1.25, ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".glyph",
            { rotate: 0 },
            { duration: 1.25, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".glyph_container",
            { x: "0%" },
            { duration: 1.25, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".wordmark",
            { x: 0, opacity: 1, marginTop: "1px" },
            { duration: 1.25, at: "<", ease: [0.76, 0, 0.24, 1] },
          ],
        ]);
        await animate([
          [
            ".logo_container",
            { width: "6rem" },
            { duration: 1.25, at: "0", ease: [0.76, 0, 0.24, 1] },
          ],
          [
            scope.current,
            { transform: "0" },
            { duration: 1.25, ease: [0.76, 0, 0.24, 1], at: "<" },
          ],
        ]);
        await animate([
          [
            ".items",
            { width: "auto", opacity: 1 },
            { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          ],
          [
            ".container",
            { backgroundColor: "rgb(255,255,255,0.5)" },
            { duration: 0.5, ease: [0.76, 0, 0.24, 1], at: "<" },
          ],
          [
            ".items > *",
            { opacity: 1 },
            {
              duration: 0.25,
              at: "<",
              delay: stagger(0.1),
              ease: [0.76, 0, 0.24, 1],
            },
          ],
        ]);
        await animate(
          ".container",
          { "--shadow-opacity": 1 },
          { duration: 1, ease: [0.76, 0, 0.24, 1] },
        );

        setHasAnimated(true);
      }
    };

    runAnimationSequence();
  }, [animate, scope, isHomePage, hasAnimated]);

  return (
    <motion.nav
      className="fixed z-50 mx-auto flex h-fit w-full items-center justify-center"
      initial={{ transform: isHomePage ? "translateY(50vh)" : "translateY(0)" }}
      ref={scope}
    >
      <motion.div
        className="container relative mt-4 flex w-fit items-center justify-center space-x-8 rounded-xl px-6 py-4"
        initial={{
          opacity: isHomePage ? 0 : 1,
          backgroundColor: isHomePage
            ? "rgb(255,255,255,0)"
            : "rgb(255,255,255,0.5)",
        }}
      >
        <Link href="/">
          <motion.div
            className="logo_container align-center relative flex rounded-xl"
            initial={{ width: isHomePage ? "16rem" : "6rem", height: "auto" }}
          >
            <motion.div
              className="glyph_container h-fit overflow-hidden"
              initial={{ width: "25%", x: isHomePage ? "200%" : "0%" }}
            >
              <motion.div
                className="glyph h-full w-full origin-bottom"
                initial={{ rotate: isHomePage ? 180 : 0 }}
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
                  x: isHomePage ? "100%" : "0%",
                  opacity: isHomePage ? 0 : 1,
                }}
              >
                <Wordmark className="h-full w-full fill-current text-zinc-700" />
              </motion.div>
            </motion.div>
          </motion.div>
        </Link>

        <motion.div
          className="items flex space-x-8"
          initial={{
            opacity: isHomePage ? 0 : 1,
            width: isHomePage ? 0 : "auto",
          }}
        >
          <motion.h1 initial={{ opacity: isHomePage ? 0 : 1 }}>
            <Link href="/services" className="text-sm text-zinc-500">
              Services
            </Link>
          </motion.h1>

          <motion.h1 initial={{ opacity: isHomePage ? 0 : 1 }}>
            <Link href="/work" className="text-sm text-zinc-500">
              Work
            </Link>
          </motion.h1>

          <motion.h1 initial={{ opacity: isHomePage ? 0 : 1 }}>
            <Link href="/about" className="text-sm text-zinc-500">
              About
            </Link>
          </motion.h1>

          <motion.h1 initial={{ opacity: isHomePage ? 0 : 1 }}>
            <Link href="/contact" className="text-sm text-zinc-500">
              Contact
            </Link>
          </motion.h1>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
