import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClientLabelProps {
  name: string;
  category?: string;
  className?: string;
}

export function ClientLabel({ name, category, className }: ClientLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn(
        "absolute bottom-6 left-6 z-10 flex items-center gap-3",
        className,
      )}
    >
      <div className="size-10 rounded-lg bg-neutral-100" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900">{name}</span>
        {category && (
          <span className="text-sm text-neutral-500">{category}</span>
        )}
      </div>
    </motion.div>
  );
}
