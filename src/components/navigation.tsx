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
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label?: string;
  size?: "large" | "small";
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
      clipRule="evenodd"
    />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
  </svg>
);

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z"
      clipRule="evenodd"
    />
  </svg>
);

const Card = ({
  href,
  icon: Icon,
  label,
  size = "small",
  className,
  onClick,
  isActive = false,
}: CardProps) => {
  const isLarge = size === "large";
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
        "frame-outer relative aspect-square overflow-hidden",
        isLarge && "col-span-2 row-span-2",
        className,
      )}
    >
      <Link
        href={href}
        onClick={onClick}
        className="relative block h-full w-full"
      >
        {isActive && (
          <video
            src="/videos/gradient-orange.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="frame-inner absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className={clsx(
            "frame-inner relative z-20 flex h-full w-full flex-col items-center justify-center space-y-2 bg-white/25 shadow-inner shadow-white/75",
          )}
        >
          <Icon
            className={clsx(
              "text-stone-600/75",
              isLarge ? "h-10 w-10" : "h-7 w-7",
            )}
          />
          {label && (
            <span className="text-md font-medium text-stone-600/75">
              {label}
            </span>
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
  currentPath,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(12px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, filter: "blur(12px)" }}
    transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
    className="fixed inset-0 z-50 flex flex-col bg-white/50 pt-24 backdrop-blur-3xl"
  >
    <div className="container h-full w-full max-w-lg px-8 pt-20">
      <div className="grid w-full auto-rows-fr grid-cols-3 gap-4">
        {/* Home - Top Left 2x2 */}
        <Card
          href="/"
          icon={HomeIcon}
          label="Home"
          size="large"
          onClick={onClose}
          isActive={currentPath === "/"}
        />

        {/* About & Services - Right Stack */}
        <div className="col-span-1 col-start-3 row-span-2 flex flex-col gap-4">
          <Card
            href="/about"
            icon={UserGroupIcon}
            label="About"
            onClick={onClose}
            isActive={currentPath === "/about"}
          />
          <Card
            href="/services"
            icon={ShoppingBagIcon}
            label="Services"
            onClick={onClose}
            isActive={currentPath === "/services"}
          />
        </div>

        {/* Social Links - Left Stack */}
        <div className="col-span-1 col-start-1 row-span-2 row-start-3 flex flex-col gap-4">
          <Card
            href="https://instagram.com"
            icon={Instagram}
            label=""
            onClick={onClose}
          />
          <Card
            href="https://x.com"
            icon={Twitter}
            label=""
            onClick={onClose}
          />
        </div>

        {/* Work - Bottom Right 2x2 */}
        <Card
          href="/work"
          icon={FolderIcon}
          label="Work"
          size="large"
          onClick={onClose}
          isActive={currentPath === "/work"}
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
      <motion.nav className="parent pointer-events-auto fixed z-[70] mx-auto flex h-fit w-full items-center justify-center">
        <Bar
          isValidPath={isValidPath}
          basePath={basePath}
          onToggle={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        />
      </motion.nav>

      {/* Mobile Cards Menu */}
      <AnimatePresence>
        {isOpen && (
          <Cards
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            currentPath={basePath}
          />
        )}
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
