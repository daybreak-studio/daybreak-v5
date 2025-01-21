import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "/public/brand/daybreak-icon.svg";
import Wordmark from "/public/brand/daybreak-wordmark.svg";
import { usePathname } from "@/lib/hooks/use-pathname";
import {
  Grip,
  Home,
  Users,
  Folder,
  ShoppingBag,
  Instagram,
  Twitter,
  LucideIcon,
  X,
} from "lucide-react";
import clsx from "clsx";
import { EASINGS } from "./animations/easings";

interface Tab {
  href: string;
  label: string;
}

const tabs: Tab[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/work",
    label: "Work",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

interface CardProps {
  href: string;
  icon: LucideIcon;
  label?: string;
  size?: "large" | "small";
  className?: string;
  onClick?: () => void;
}

const Card = ({
  href,
  icon: Icon,
  label,
  size = "small",
  className,
  onClick,
}: CardProps) => {
  const isLarge = size === "large";

  // Random delay between 0.2 and 0.5 seconds
  const MIN_DELAY = 0.2;
  const MAX_DELAY = 0.5;
  const randomDelay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.9,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1,
        delay: randomDelay,
        ease: EASINGS.easeOutQuart,
      }}
      className={clsx(
        "frame-outer aspect-square",
        isLarge && "col-span-2 row-span-2",
        className,
      )}
    >
      <Link href={href} onClick={onClick} className="block h-full w-full">
        <div className="frame-inner flex h-full w-full flex-col items-center justify-center space-y-2 bg-white/20">
          <Icon
            className={clsx("text-stone-500", isLarge ? "h-8 w-8" : "h-6 w-6")}
          />
          {label && (
            <span className="text-xs font-medium text-stone-600">{label}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

const MenuToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <nav
    className="relative z-[120] flex aspect-square items-center justify-center rounded-md bg-white md:hidden"
    onClick={onClick}
  >
    <AnimatePresence mode="wait" initial={false}>
      {isOpen ? (
        <motion.div
          key="x"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: EASINGS.easeOutQuart }}
        >
          <X
            className="m-3 aspect-square h-3 w-3 text-stone-500"
            strokeWidth={2.25}
          />
        </motion.div>
      ) : (
        <motion.div
          key="grip"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: EASINGS.easeOutQuart }}
        >
          <Grip
            className="m-3 aspect-square h-3 w-3 text-stone-500"
            strokeWidth={2.25}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

const Bar = ({
  isValidPath,
  basePath,
  onToggle,
  isOpen,
}: {
  isValidPath: boolean;
  basePath: string;
  onToggle: () => void;
  isOpen: boolean;
}) => (
  <motion.div className="container relative mt-4 flex w-fit items-stretch justify-center overflow-hidden rounded-xl border-[1px] border-stone-300/25 bg-stone-50/95 p-1 mix-blend-multiply shadow-lg backdrop-blur-3xl md:rounded-2xl">
    {/* Logo */}
    <Link href="/" className="relative flex items-stretch rounded-xl">
      <div className="logo_container align-center relative m-2 flex w-20 rounded-none md:m-0 md:mx-4 md:rounded-xl md:p-0 md:pt-[2px]">
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
      {isValidPath && basePath === "/" && <Pill />}
    </Link>

    {/* Mobile Menu Toggle */}
    <MenuToggle isOpen={isOpen} onClick={onToggle} />

    {/* Navigation Links */}
    <div className="items relative hidden space-x-1 md:flex">
      {tabs
        .filter((tab) => tab.href !== "/")
        .map((tab) => (
          <Link href={tab.href} className="rounded-xl" key={tab.label}>
            <motion.h1 className="relative px-3 py-3 text-xs font-normal text-stone-500">
              <span className="relative z-10">{tab.label}</span>
              {isValidPath && basePath === tab.href && <Pill />}
            </motion.h1>
          </Link>
        ))}
    </div>
  </motion.div>
);

const Cards = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(12px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, filter: "blur(12px)" }}
    transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
    className="fixed inset-0 z-[90] flex flex-col bg-white/50 pt-24 backdrop-blur-3xl"
  >
    <div className="container h-full w-full max-w-lg px-8 pt-20">
      <div className="grid w-full auto-rows-fr grid-cols-3 gap-4">
        {/* Home - Top Left 2x2 */}
        <Card
          href="/"
          icon={Home}
          label="Home"
          size="large"
          onClick={onClose}
        />

        {/* About & Services - Right Stack */}
        <div className="col-span-1 col-start-3 row-span-2 flex flex-col gap-4">
          <Card href="/about" icon={Users} label="About" onClick={onClose} />
          <Card
            href="/services"
            icon={ShoppingBag}
            label="Services"
            onClick={onClose}
          />
        </div>

        {/* Social Links - Left Stack */}
        <div className="col-span-1 col-start-1 row-span-2 row-start-3 flex flex-col gap-4">
          <Card
            href="https://instagram.com"
            icon={Instagram}
            label="Instagram"
            onClick={onClose}
          />
          <Card
            href="https://x.com"
            icon={Twitter}
            label="Twitter"
            onClick={onClose}
          />
        </div>

        {/* Work - Bottom Right 2x2 */}
        <Card
          href="/work"
          icon={Folder}
          label="Work"
          size="large"
          onClick={onClose}
          className="col-start-2 row-start-3"
        />
      </div>
    </div>
  </motion.div>
);

export default function Navigation() {
  const { basePath } = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isValidPath = tabs.some((tab) => tab.href === basePath);

  return (
    <>
      <motion.nav className="parent pointer-events-auto fixed z-[100] mx-auto flex h-fit w-full items-center justify-center">
        <Bar
          isValidPath={isValidPath}
          basePath={basePath}
          onToggle={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        />
      </motion.nav>

      {/* Mobile Cards Menu */}
      <AnimatePresence>
        {isOpen && <Cards isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

const Pill = () => {
  return (
    <motion.span
      layout
      layoutId="pill"
      className="pill absolute inset-0 z-0 rounded-md md:rounded-xl md:border-[1px] md:border-stone-600/5 md:bg-white md:shadow-lg md:shadow-stone-500/15"
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
