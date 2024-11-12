import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useVisit } from "@/contexts/VisitContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { visitStatus, isLoading } = useVisit();
  const router = useRouter();

  if (isLoading) {
    return null; // or a loading spinner
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
