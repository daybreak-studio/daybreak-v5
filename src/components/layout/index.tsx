import { motion } from "framer-motion";
import { useVisit } from "@/contexts/VisitContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { visitStatus, isLoading } = useVisit();

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: visitStatus === "new" ? 1 : 0.25,
        delay: visitStatus === "new" ? 1.5 : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
