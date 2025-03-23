import { motion } from "framer-motion";
import Link from "next/link";
import { EASINGS } from "@/components/animations/easings";
import Logo from "/public/brand/daybreak-icon.svg";
import Metadata from "@/components/metadata";

export default function NotFound() {
  return (
    <>
      <Metadata
        title="Page Not Found | Daybreak Studio"
        description="Sorry, the page you're looking for doesn't exist."
        noIndex={true}
      />
      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
        {/* Animated Content */}
        <motion.div
          className="relative flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: EASINGS.easeOutExpo,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: EASINGS.easeOutExpo,
            }}
          >
            <Logo className="h-8 w-8 fill-current text-neutral-500/50" />
          </motion.div>

          {/* Text Content */}
          <motion.h1
            className="text-neutral-500/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: EASINGS.easeOutExpo,
            }}
          >
            Sorry, the page you&apos;re on doesn&apos;t exist.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: EASINGS.easeOutExpo,
            }}
          >
            <Link
              href="/"
              className="group relative text-neutral-500/50 transition-colors duration-300 hover:text-neutral-500/75"
            >
              Let&apos;s get you back home?
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
