import React, { useEffect, useState } from "react";
import { animate, motion, stagger } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "/public/logos/daybreak-icon.svg";
import Wordmark from "/public/logos/daybreak-wordmark.svg";
import { useVisit } from "@/contexts/VisitContext";
import { useBaseRoute } from "../../hooks/useBaseRoute";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Ellipsis,
  Grip,
  GripVertical,
  LayoutGrid,
  Maximize,
  Maximize2,
  Menu,
} from "lucide-react";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const { visitStatus, isLoading, markVisitComplete } = useVisit();
  const { isBaseRoute, currentBasePath } = useBaseRoute();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (visitStatus === "new" && isBaseRoute) {
      runAnimationSequence();
      markVisitComplete();
    }
  }, [visitStatus, isBaseRoute, markVisitComplete]);

  const runAnimationSequence = async () => {
    await animate([
      [".container", { opacity: 1 }, { duration: 1, ease: [0.76, 0, 0.24, 1] }],
      [
        ".glyph",
        { rotate: 0 },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".glyph_container",
        { x: "0%" },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".wordmark",
        { x: 0, opacity: 1, marginTop: "1px" },
        { duration: 1, at: "<", ease: [0.76, 0, 0.24, 1] },
      ],
    ]);
    await animate([
      [
        ".logo_container",
        { width: "5rem" },
        { duration: 1, at: "0", ease: [0.76, 0, 0.24, 1] },
      ],
      [
        ".parent",
        { transform: "translateY(0)" },
        { duration: 1, ease: [0.76, 0, 0.24, 1], at: "<" },
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
        { backgroundColor: "rgb(250,250,250,1)" },
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
      [
        ".container",
        {
          border: "1px solid rgba(0, 0, 0, 0.02)",
          boxShadow: "rgba(0, 0, 0, 0.04) 0px 2px 8px 0px",
        },
        { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
      ],
    ]);
    await animate(
      ".pill",
      { opacity: 1 },
      { duration: 1, ease: [0.76, 0, 0.24, 1] },
    );
  };

  if (isLoading) {
    return null;
  }

  const isValidPath = tabs.some((tab) => tab.href === currentBasePath);

  return (
    <motion.nav
      className="parent pointer-events-auto fixed z-50 mx-auto flex h-fit w-full items-center justify-center"
      initial={{
        transform: visitStatus === "new" ? "translateY(50vh)" : "translateY(0)",
      }}
    >
      <motion.div
        className={`container relative mt-4 flex w-fit items-stretch justify-center rounded-xl p-1 md:rounded-2xl`}
        initial={{
          boxShadow:
            visitStatus === "new"
              ? "none"
              : "rgba(0, 0, 0, 0.08) 0px 2px 8px 0px",
          border:
            visitStatus === "new" ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
          opacity: visitStatus === "new" ? 0 : 1,
          backgroundColor:
            visitStatus === "new"
              ? "rgb(255,255,255,0)"
              : "rgb(250,250,250 ,1)",
        }}
      >
        {tabs.map((tab) =>
          tab.href === "/" ? (
            <Link
              key={tab.href}
              href="/"
              className="relative flex items-stretch"
            >
              <motion.div
                className="logo_container align-center relative m-2 flex rounded-none p-1 md:m-0 md:mx-4 md:rounded-xl md:p-0"
                initial={{ width: visitStatus === "new" ? "16rem" : "5rem" }}
              >
                <motion.div
                  className="glyph_container z-10 flex items-center overflow-hidden"
                  initial={{
                    width: "25%",
                    x: visitStatus === "new" ? "200%" : "0%",
                  }}
                >
                  <motion.div
                    className="glyph h-full w-full origin-bottom pb-1"
                    initial={{ rotate: visitStatus === "new" ? 180 : 0 }}
                  >
                    <Logo className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="wordmark_container z-10 flex items-center overflow-hidden pl-[6%]"
                  initial={{ width: "75%" }}
                >
                  <motion.div
                    className="wordmark h-full w-full"
                    initial={{
                      x: visitStatus === "new" ? "100%" : "0%",
                      opacity: visitStatus === "new" ? 0 : 1,
                    }}
                  >
                    <Wordmark className="h-full w-full fill-current text-zinc-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
              {isValidPath && currentBasePath === tab.href && (
                <Pill isFirstVisit={visitStatus === "new"} />
              )}
            </Link>
          ) : null,
        )}
        <div
          className="flex aspect-square items-center justify-center rounded-md bg-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Grip
            className="m-3 aspect-square h-3 w-3 text-zinc-500"
            strokeWidth={2.25}
          />
        </div>
        <motion.div
          className="items relative hidden md:flex"
          initial={{
            opacity: visitStatus === "new" ? 0 : 1,
            width: visitStatus === "new" ? 0 : "auto",
          }}
        >
          {tabs.map((tab) =>
            tab.href !== "/" ? (
              <motion.h1
                key={tab.label}
                initial={{ opacity: visitStatus === "new" ? 0 : 1 }}
                className="relative px-4 py-3 text-xs font-normal text-zinc-500"
              >
                <Link href={tab.href} className="relative z-10">
                  {tab.label}
                </Link>
                {isValidPath && currentBasePath === tab.href && (
                  <Pill isFirstVisit={visitStatus === "new"} />
                )}
              </motion.h1>
            ) : null,
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}

const Pill = ({ isFirstVisit }: { isFirstVisit: boolean }) => {
  return (
    <motion.span
      layout
      // layoutRoot
      layoutId="pill"
      className="pill absolute inset-0 z-0 rounded-md bg-white md:rounded-xl"
      style={{ originY: "top" }}
      initial={{ opacity: isFirstVisit ? 0 : 1 }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.4,
        ease: "easeOut",
      }}
    />
  );
};
