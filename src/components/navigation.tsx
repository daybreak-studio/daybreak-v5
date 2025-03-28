import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "/public/brand/daybreak-icon.svg";
import Wordmark from "/public/brand/daybreak-wordmark.svg";
import { usePathname } from "@/lib/hooks/use-pathname";
import { Grip, Instagram, Twitter, LucideIcon, X } from "lucide-react";
import clsx from "clsx";
import { EASINGS } from "./animations/easings";

interface Tab {
  href: string;
  label: string;
}

const tabs: Tab[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
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
  isActive,
}: CardProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 1, ease: EASINGS.easeOutQuart },
      },
    }}
    className={clsx(
      "frame-outer relative aspect-square overflow-hidden",
      size === "large" && "col-span-2 row-span-2",
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
      <div className="frame-inner relative z-20 flex h-full w-full flex-col items-center justify-center space-y-2 bg-white/25 shadow-inner shadow-white/75">
        <Icon
          className={clsx(
            "text-neutral-600/75",
            size === "large" ? "h-10 w-10" : "h-7 w-7",
          )}
        />
        {label && (
          <span className="text-md font-medium text-neutral-600/75">
            {label}
          </span>
        )}
      </div>
    </Link>
  </motion.div>
);

const MobileMenu = ({
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
    className={clsx(
      "fixed inset-0 z-[110] flex h-[100dvh] flex-col items-center bg-white/50 pt-12 backdrop-blur-3xl",
      isOpen && "touch-none overflow-hidden",
    )}
    onClick={onClose}
  >
    <div
      className="container relative flex h-full w-full max-w-lg flex-col items-center justify-center px-8"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className="grid w-full auto-rows-fr grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, when: "beforeChildren" },
          },
        }}
      >
        <Card
          href="/"
          icon={HomeIcon}
          label="Home"
          size="large"
          onClick={onClose}
          isActive={currentPath === "/"}
        />

        <div className="col-span-1 col-start-3 row-span-2 flex flex-col gap-4">
          <Card
            href="/team"
            icon={UserGroupIcon}
            label="Team"
            onClick={onClose}
            isActive={currentPath === "/team"}
          />
          <Card
            href="/services"
            icon={ShoppingBagIcon}
            label="Services"
            onClick={onClose}
            isActive={currentPath === "/services"}
          />
        </div>

        <div className="col-span-1 col-start-1 row-span-2 row-start-3 flex flex-col gap-4">
          <Card
            href="https://instagram.com"
            icon={Instagram}
            onClick={onClose}
          />
          <Card href="https://x.com" icon={Twitter} onClick={onClose} />
        </div>

        <Card
          href="/work"
          icon={FolderIcon}
          label="Work"
          size="large"
          onClick={onClose}
          isActive={currentPath === "/work"}
          className="col-start-2 row-start-3"
        />
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay: 1,
              duration: 0.8,
              ease: EASINGS.easeOutQuart,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className="pt-12 text-center"
      >
        <Link
          href="/contact"
          onClick={onClose}
          className="frame-outer rounded-full bg-white/80 px-6 py-4 text-center font-medium text-neutral-500"
        >
          <span className="relative">Contact Us</span>
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

interface NavigationProps {
  forceHide?: boolean;
  disableScrollHiding?: boolean;
}
// Add a simple event system to handle video pausing
export const VIDEO_EVENTS = {
  PAUSE_ALL: "PAUSE_ALL_VIDEOS",
  RESUME_ALL: "RESUME_ALL_VIDEOS",
};

function useScrollDirection(disabled?: boolean) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [prevScroll, setPrevScroll] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (disabled) {
      setVisible(true);
      return;
    }

    const threshold = 10;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScroll = window.scrollY;

      if (Math.abs(currentScroll - prevScroll) < threshold) {
        ticking = false;
        return;
      }

      if (currentScroll < threshold) {
        setVisible(true);
        setPrevScroll(currentScroll);
        ticking = false;
        return;
      }

      setVisible(currentScroll < prevScroll);
      setScrollDirection(currentScroll > prevScroll ? "down" : "up");
      setPrevScroll(currentScroll);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [prevScroll, disabled]);

  return disabled ? true : visible;
}

export default function Navigation({
  forceHide,
  disableScrollHiding,
}: NavigationProps) {
  const { basePath } = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isValidPath = tabs.some((tab) => tab.href === basePath);
  const showNav = useScrollDirection(disableScrollHiding);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Add effect for video control
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event(VIDEO_EVENTS.PAUSE_ALL));
      document.body.style.overflow = "hidden";
    } else {
      window.dispatchEvent(new Event(VIDEO_EVENTS.RESUME_ALL));
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        className={clsx(
          "pointer-events-auto fixed left-0 right-0 top-0 z-[50] flex w-screen justify-center",
          isOpen && "z-[120]",
        )}
        initial={{ opacity: 1, filter: "blur(0px)" }}
        animate={{
          opacity: !showNav || forceHide ? 0 : 1,
          filter: !showNav || forceHide ? "blur(10px)" : "blur(0px)",
        }}
        transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
      >
        <div className="frame-outer mt-4 flex w-fit items-stretch justify-center overflow-hidden border-[1px] border-neutral-300/25 bg-neutral-50 mix-blend-multiply shadow-lg shadow-neutral-500/5 backdrop-blur-3xl">
          <Link
            href="/"
            className="frame-inner group pointer-events-none relative flex items-stretch md:pointer-events-auto"
          >
            <div className="logo_container frame-inner align-center relative m-2 flex w-20 rounded-none md:m-0 md:mx-4 md:p-0 md:pt-[2px]">
              <div className="glyph_container z-10 flex w-1/4 items-center overflow-hidden">
                <Logo className="h-full w-full fill-current pb-1 text-neutral-500" />
              </div>
              <div className="wordmark_container z-10 flex w-3/4 items-center overflow-hidden pl-[6%]">
                <Wordmark className="h-full w-full fill-current text-neutral-500" />
              </div>
            </div>
            {isValidPath && basePath === "/" && (
              <div className="hidden md:block">
                <Pill />
              </div>
            )}
          </Link>

          <nav
            className="frame-inner relative z-[120] flex aspect-square items-center justify-center bg-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
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
                    className="m-3 aspect-square h-3 w-3 text-neutral-500"
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
                    className="m-3 aspect-square h-3 w-3 text-neutral-500"
                    strokeWidth={2.25}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          <div className="items relative hidden space-x-1 md:flex">
            {tabs
              .filter((tab) => tab.href !== "/")
              .map((tab) => (
                <Link
                  href={tab.href}
                  className="frame-inner group"
                  key={tab.label}
                >
                  <motion.h1 className="relative px-3 py-3 text-xs font-normal text-neutral-500 group-hover:text-neutral-700">
                    <span className="relative z-10">{tab.label}</span>
                    {isValidPath && basePath === tab.href && <Pill />}
                  </motion.h1>
                </Link>
              ))}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {isOpen && (
          <MobileMenu
            key={Date.now()}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            currentPath={basePath}
          />
        )}
      </AnimatePresence>
    </>
  );
}
const Pill = () => (
  <motion.span
    layout
    layoutId="pill"
    style={{ originY: "0px" }}
    className="pill frame-inner absolute inset-0 z-0 before:pointer-events-none before:absolute before:inset-0 before:rounded-[30px] before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,245,230,0.5)_0%,rgba(255,240,235,0.4)_25%,rgba(250,235,245,0.3)_50%,rgba(245,240,255,0.2)_75%,rgba(250,250,255,0.1)_100%)] before:p-[1px] before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100 md:border-[1px] md:border-neutral-600/5 md:bg-white md:shadow-lg md:shadow-neutral-500/15"
    animate={{
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    }}
    transition={{
      layout: { type: "spring", bounce: 0.2, duration: 0.4, ease: "easeOut" },
      boxShadow: { duration: 0.3 },
    }}
  />
);
