import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";

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
      "relative h-auto rounded-xl bg-stone-800 px-8 py-4 text-xs text-stone-100 hover:scale-[101%] hover:bg-stone-900 md:text-sm",
      "shadow-md shadow-stone-900/25 hover:shadow-lg",
      "transition-all duration-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2",
      "disabled:opacity-25",
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
  <div className="frame-outer p-1">
    <div
      className={cn(
        "frame-inner flex w-[90vw] flex-col bg-neutral-50 backdrop-blur-3xl",
        "shadow-[0_0_15px_rgba(0,0,0,0.05)]",
        "border border-white/50",
        "p-8 sm:w-[32rem] md:p-10",
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
}: {
  current: number;
  total: number;
  onNext?: () => void;
  onPrev?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <button
        className="rounded-lg p-2 opacity-40 transition-opacity hover:opacity-100 disabled:opacity-20"
        onClick={onPrev}
        disabled={current === 1}
        aria-label="Previous"
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-sm text-stone-500/50 md:text-base">
        {current} of {total}
      </span>
      <button
        className="rounded-lg p-2 opacity-40 transition-opacity hover:opacity-100 disabled:opacity-20"
        onClick={onNext}
        disabled={current === total}
        aria-label="Next"
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

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
