import { motion } from "framer-motion";
import { useVisit } from "@/contexts/VisitContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { hasVisitedBefore } = useVisit();
  console.log(hasVisitedBefore);
  if (hasVisitedBefore !== null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: hasVisitedBefore ? 0.25 : 1,
          delay: hasVisitedBefore ? 0 : 1.5,
        }}
      >
        {children}
      </motion.div>
    );
  }
}
