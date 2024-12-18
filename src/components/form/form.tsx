import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Form Button Component
export const FormCTAButton = ({
  onClick,
  disabled,
  children = "Next",
  type = "button",
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
}) => (
  <Button
    onClick={onClick}
    type={type}
    disabled={disabled}
    className={cn(
      "relative h-auto rounded-xl bg-stone-900 px-8 py-4 text-xs text-stone-100 md:text-sm",
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

// Form Card Components
const FormCardRoot = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
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

const FormCardHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <div className={cn("flex w-full flex-col", className)}>{children}</div>;

const FormCardNavigation = ({
  current,
  total,
  onNext,
  onPrev,
  className,
}: {
  current: number;
  total: number;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}) => (
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

const FormCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2 className={cn("text-stone-600 md:text-2xl", className)}>{children}</h2>
);

const FormCardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("w-full", className)}>{children}</div>;

export const FormCard = {
  Root: FormCardRoot,
  Header: FormCardHeader,
  Navigation: FormCardNavigation,
  Title: FormCardTitle,
  Content: FormCardContent,
};

// Form Steps
export { createFormSteps } from "./steps";
