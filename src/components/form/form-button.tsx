import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormCTAButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
}

export const FormCTAButton = ({
  onClick,
  disabled,
  children = "Next",
  type = "button",
  className,
}: FormCTAButtonProps) => (
  <Button
    onClick={onClick}
    type={type}
    disabled={disabled}
    variant="ghost"
    className={cn(
      "relative h-auto rounded-xl px-8 py-4 text-xs text-stone-100 md:text-sm",
      "bg-stone-900 hover:bg-stone-800",
      "shadow-md shadow-stone-900/25 hover:shadow-md hover:shadow-stone-800/25",
      "transition-all duration-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2",
      "disabled:opacity-50",
      className,
    )}
  >
    {children}
  </Button>
);
