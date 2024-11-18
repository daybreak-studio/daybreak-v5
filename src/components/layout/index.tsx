import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useVisit } from "@/contexts/VisitContext";
import { useBaseRoute } from "@/hooks/useBaseRoute";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { visitStatus, isLoading } = useVisit();
  const { isBaseRoute } = useBaseRoute();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  // If not a base route, render without transitions
  if (!isBaseRoute) {
    return <div className="pt-24">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="pt-24"
        key={router.asPath}
        initial={{ opacity: visitStatus === "new" ? 0 : 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: visitStatus === "new" ? 0 : 1 }}
        transition={{
          duration: visitStatus === "new" ? 1 : 0,
          delay: visitStatus === "new" ? 1.5 : 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
