import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCardRootProps {
  children: React.ReactNode;
  className?: string;
}

interface FormCardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

interface FormCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface FormCardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface FormCardNavigationProps {
  current: number;
  total: number;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

const FormCardRoot = ({ children, className }: FormCardRootProps) => (
  <div className="frame-outer">
    <div
      className={cn(
        "frame-inner flex w-[90vw] flex-col p-8 sm:w-[32rem] md:p-10",
        "bg-gradient-to-b from-[#FDFCFA] via-[#FDF9F7] to-[#FCFCFC]",
        "backdrop-blur-[2px]",
        className,
      )}
    >
      {children}
    </div>
  </div>
);

const FormCardHeader = ({ children, className }: FormCardHeaderProps) => (
  <div className={cn("flex w-full flex-col", className)}>{children}</div>
);

const FormCardNavigation = ({
  current,
  total,
  onNext,
  onPrev,
  className,
}: FormCardNavigationProps) => (
  <div className={cn("flex items-center justify-between", className)}>
    <button
      className={cn(
        "rounded-lg p-2 opacity-40 transition-opacity hover:opacity-100 disabled:opacity-20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-4",
      )}
      onClick={onPrev}
      disabled={current === 1}
      aria-label="Previous"
      type="button"
      tabIndex={0}
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
    <span className="text-sm text-stone-500/50 md:text-base">
      {current} of {total}
    </span>
    <button
      className={cn(
        "rounded-lg p-2 opacity-40 transition-opacity hover:opacity-100 disabled:opacity-20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-4",
      )}
      onClick={onNext}
      disabled={current === total}
      aria-label="Next"
      type="button"
      tabIndex={0}
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  </div>
);

const FormCardTitle = ({ children, className }: FormCardTitleProps) => (
  <h2 className={cn("text-stone-600 md:text-2xl", className)}>{children}</h2>
);

const FormCardContent = ({ children, className }: FormCardContentProps) => (
  <div className={cn("w-full", className)}>{children}</div>
);

export const FormCard = {
  Root: FormCardRoot,
  Header: FormCardHeader,
  Navigation: FormCardNavigation,
  Title: FormCardTitle,
  Content: FormCardContent,
};
