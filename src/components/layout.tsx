import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { EASINGS } from "./animations/easings";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const prevPathRef = useRef(router.asPath);

  const isBasePath = !router.asPath.split("/")[2];
  const wasSubRoute = prevPathRef.current.split("/")[2];
  const currentBaseSegment = router.asPath.split("/")[1];

  useEffect(() => {
    prevPathRef.current = router.asPath;
  }, [router.asPath]);

  if (!isBasePath || wasSubRoute) {
    return <div className="pt-24">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="pt-24"
        key={currentBaseSegment}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: EASINGS.easeOutQuart,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
