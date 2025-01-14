import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "/public/brand/daybreak-icon.svg";
import Wordmark from "/public/brand/daybreak-wordmark.svg";
import { usePathname } from "@/lib/hooks/use-pathname";
import { Grip } from "lucide-react";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const { basePath } = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isValidPath = tabs.some((tab) => tab.href === basePath);

  return (
    <motion.nav className="parent pointer-events-auto fixed z-50 mx-auto flex h-fit w-full items-center justify-center">
      <motion.div className="container relative mt-4 flex w-fit items-stretch justify-center overflow-hidden rounded-xl border-[1px] border-stone-300/25 bg-stone-50/95 p-1 mix-blend-multiply shadow-lg backdrop-blur-3xl md:rounded-2xl">
        {tabs.map((tab) =>
          tab.href === "/" ? (
            <Link
              key={tab.href}
              href="/"
              className="relative flex items-stretch"
            >
              <div className="logo_container align-center relative m-2 flex w-20 rounded-none p-1 md:m-0 md:mx-4 md:rounded-xl md:p-0">
                <div className="glyph_container z-10 flex w-1/4 items-center overflow-hidden">
                  <div className="glyph h-full w-full origin-bottom pb-1">
                    <Logo className="h-full w-full fill-current text-stone-500" />
                  </div>
                </div>
                <div className="wordmark_container z-10 flex w-3/4 items-center overflow-hidden pl-[6%]">
                  <div className="wordmark h-full w-full">
                    <Wordmark className="h-full w-full fill-current text-stone-500" />
                  </div>
                </div>
              </div>
              {isValidPath && basePath === tab.href && <Pill />}
            </Link>
          ) : null,
        )}
        <div
          className="flex aspect-square items-center justify-center rounded-md bg-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Grip
            className="m-3 aspect-square h-3 w-3 text-stone-500"
            strokeWidth={2.25}
          />
        </div>
        <div className="items relative hidden md:flex">
          {tabs.map((tab) =>
            tab.href !== "/" ? (
              <motion.h1
                key={tab.label}
                className="relative px-4 py-3 text-xs font-normal text-stone-500"
              >
                <Link href={tab.href} className="relative z-10">
                  {tab.label}
                </Link>
                {isValidPath && basePath === tab.href && <Pill />}
              </motion.h1>
            ) : null,
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}

const Pill = () => {
  return (
    <motion.span
      layout
      layoutId="pill"
      className="pill absolute inset-0 z-0 rounded-md border-[1px] border-stone-600/5 bg-white shadow-lg shadow-stone-500/15 md:rounded-xl"
      style={{ originY: "top" }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.4,
        ease: "easeOut",
      }}
    />
  );
};
