import { FormCard, FormCTAButton } from "./form";
import { ProjectTypes, ContactFormValues } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { Dot } from "lucide-react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProjectType = keyof typeof ProjectTypes;

interface FormStepsProps {
  form: UseFormReturn<ContactFormValues>;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: (data: ContactFormValues) => Promise<void>;
  setCurrentStep: (step: number) => void;
}

export const createFormSteps = ({
  form,
  nextStep,
  prevStep,
  onSubmit,
  setCurrentStep,
}: FormStepsProps) => {
  const handleSubmit = async (data: ContactFormValues) => {
    await onSubmit(data);
  };

  const values = form.watch();

  const findEarliestInvalidStep = () => {
    const values = form.getValues();
    const errors = form.formState.errors;

    // Check each step in order
    if (!values.fullName || !values.email || errors.fullName || errors.email) {
      return 1; // Contact Info (step 2)
    }
    if (!values.projectTypes?.length) {
      return 2; // Project Type (step 3)
    }
    if (!values.message || errors.message) {
      return 3; // Project Details (step 4)
    }
    return 4; // Review (step 5)
  };

  const Welcome = () => {
    const [copied, setCopied] = useState(false);

    return (
      <FormCard.Root>
        <FormCard.Header className="space-y-6">
          <FormCard.Navigation
            current={1}
            total={5}
            onNext={nextStep}
            onPrev={prevStep}
          />
          <FormCard.Title>Want to launch your next project?</FormCard.Title>
        </FormCard.Header>
        <FormCard.Content className="mt-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <span className="text-sm text-neutral-400 md:text-lg">
              We&apos;re looking for people excited by the possibilities of
              technology, constantly exploring new means of expression and
              highly detailed in their practice.
            </span>
            <div className="flex items-center justify-between rounded-2xl border border-neutral-500/10 p-4">
              <span className="text-xs text-neutral-500/75 md:text-base">
                Email us:
              </span>
              <button
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl hover:cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-4",
                )}
                onClick={() => {
                  navigator.clipboard.writeText("hello@daybreak.studio");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                type="button"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="copied"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: EASINGS.easeOutQuart,
                      }}
                    >
                      <span className="text-xs text-neutral-500/75 md:text-base">
                        Copied to clipboard!
                      </span>
                      <ClipboardDocumentCheckIcon className="h-4 w-4 text-neutral-500/75" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: EASINGS.easeInQuart,
                      }}
                    >
                      <span className="text-xs text-neutral-500/75 md:text-base">
                        hello@daybreak.studio
                      </span>
                      <ClipboardDocumentIcon className="h-4 w-4 text-neutral-500/75" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <FormCTAButton onClick={nextStep}>Get Started</FormCTAButton>
          </div>
        </FormCard.Content>
      </FormCard.Root>
    );
  };

  return [
    {
      id: "welcome",
      content: <Welcome />,
    },
    {
      id: "contact-info",
      content: (
        <FormCard.Root>
          <FormCard.Header className="space-y-6">
            <FormCard.Navigation
              current={2}
              total={5}
              onNext={nextStep}
              onPrev={prevStep}
            />
            <FormCard.Title>Let&apos;s get to know you</FormCard.Title>
          </FormCard.Header>
          <FormCard.Content className="mt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1 text-neutral-500">
                      Full Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl border-[1px] border-neutral-200 text-neutral-500 placeholder:text-neutral-400 focus:ring-black"
                        placeholder="Your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1 text-neutral-500">
                      Email
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl border-[1px] border-neutral-200 text-neutral-500 placeholder:text-neutral-400 focus:ring-black"
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormCTAButton
                onClick={async () => {
                  const isValid = await form.trigger(["fullName", "email"]);
                  if (isValid) nextStep();
                }}
                disabled={
                  !values.fullName ||
                  !values.email ||
                  !!form.formState.errors.fullName ||
                  !!form.formState.errors.email
                }
              >
                Next
              </FormCTAButton>
            </div>
          </FormCard.Content>
        </FormCard.Root>
      ),
    },
    {
      id: "project-type",
      content: (
        <FormCard.Root>
          <FormCard.Header className="space-y-6">
            <FormCard.Navigation
              current={3}
              total={5}
              onNext={nextStep}
              onPrev={prevStep}
            />
            <FormCard.Title>
              What type of project are you looking for?
            </FormCard.Title>
          </FormCard.Header>
          <FormCard.Content className="mt-8">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="projectTypes"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Object.entries(ProjectTypes).map(([value, label]) => {
                        const isSelected = field.value?.includes(
                          value as ProjectType,
                        );

                        return (
                          <FormField
                            key={value}
                            control={form.control}
                            name="projectTypes"
                            render={({ field }) => (
                              <FormItem>
                                <label className="relative flex cursor-pointer flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white/20 p-4 text-sm transition-colors hover:bg-white/30">
                                  <span className="cursor-pointer text-neutral-500">
                                    {label}
                                  </span>
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => {
                                        const newValue = isSelected
                                          ? field.value?.filter(
                                              (item) => item !== value,
                                            )
                                          : [
                                              ...(field.value || []),
                                              value as ProjectType,
                                            ];
                                        field.onChange(newValue);
                                      }}
                                      className="border-neutral-500/20 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
                                    />
                                  </FormControl>
                                </label>
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormCTAButton
                onClick={async () => {
                  const isValid = await form.trigger("projectTypes");
                  if (isValid) nextStep();
                }}
                disabled={!values.projectTypes?.length}
                className="w-full"
              >
                Next
              </FormCTAButton>
            </div>
          </FormCard.Content>
        </FormCard.Root>
      ),
    },
    {
      id: "project-details",
      content: (
        <FormCard.Root>
          <FormCard.Header className="space-y-6">
            <FormCard.Navigation
              current={4}
              total={5}
              onNext={nextStep}
              onPrev={prevStep}
            />
            <FormCard.Title>Tell us more about your project</FormCard.Title>
          </FormCard.Header>
          <FormCard.Content className="mt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Project Details
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your vision, goals, and any specific requirements..."
                        className="h-32 w-full resize-none rounded-2xl bg-neutral-50 p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl border-[1px] border-neutral-200 text-neutral-500 placeholder:text-neutral-400 focus:ring-black"
                        placeholder="https://..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormCTAButton
                onClick={async () => {
                  const isValid = await form.trigger(["message", "link"]);
                  if (isValid) nextStep();
                }}
                disabled={!values.message || !!form.formState.errors.message}
              >
                Next
              </FormCTAButton>
            </div>
          </FormCard.Content>
        </FormCard.Root>
      ),
    },
    {
      id: "review",
      content: (
        <FormCard.Root>
          <FormCard.Header className="space-y-6">
            <FormCard.Navigation current={5} total={5} onPrev={prevStep} />
            <FormCard.Title>Review Your Information</FormCard.Title>
          </FormCard.Header>
          <FormCard.Content className="mt-8">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Contact Details
                    </h3>
                    <Dot
                      className={cn(
                        "h-6 w-6 pt-[1px]",
                        values.fullName && values.email
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-sm",
                        values.fullName
                          ? "text-neutral-600"
                          : "text-neutral-400",
                      )}
                    >
                      {values.fullName || "No name provided"}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        values.email ? "text-neutral-600" : "text-neutral-400",
                      )}
                    >
                      {values.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Project Types
                    </h3>
                    <Dot
                      className={cn(
                        "h-6 w-6 pt-[1px]",
                        values.projectTypes?.length > 0
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      values.projectTypes?.length > 0
                        ? "text-neutral-600"
                        : "text-neutral-400",
                    )}
                  >
                    {values.projectTypes?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {values.projectTypes?.map((type) => (
                          <span
                            key={type}
                            className="rounded-full bg-neutral-200/50 px-3 py-1 text-sm text-neutral-600"
                          >
                            {ProjectTypes[type]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No project types selected."
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Project Details
                    </h3>
                    <Dot
                      className={cn(
                        "h-6 w-6 pt-[1px]",
                        values.message ? "text-green-500" : "text-red-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      values.message ? "text-neutral-600" : "text-neutral-400",
                    )}
                  >
                    {values.message || "Tell us about your vision!"}
                  </p>
                </div>

                {values.link && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Reference Link
                    </h3>
                    <a
                      href={values.link}
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {values.link}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <FormCTAButton
                  type="submit"
                  onClick={async () => {
                    const isValid = await form.trigger();
                    if (isValid) {
                      await handleSubmit(values);
                      nextStep(); // Navigate after successful submission
                    }
                  }}
                  disabled={
                    form.formState.isSubmitting ||
                    !form.formState.isValid ||
                    !values.fullName ||
                    !values.email ||
                    !values.projectTypes?.length ||
                    !values.message
                  }
                >
                  {form.formState.isSubmitting ? "Sending..." : "Submit"}
                </FormCTAButton>
                <button
                  type="button"
                  onClick={() => {
                    const earliestInvalidStep = findEarliestInvalidStep();
                    // Set current step to the earliest invalid step (adding 1 because steps are 1-based)
                    setCurrentStep(earliestInvalidStep);
                  }}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Edit my response
                </button>
              </div>
            </div>
          </FormCard.Content>
        </FormCard.Root>
      ),
    },
    {
      id: "success",
      content: (
        <>
          <FormCard.Root>
            <FormCard.Header className="space-y-6">
              <FormCard.Title>
                Thank you{" "}
                {(() => {
                  const fullName = values.fullName;
                  if (!fullName) return "";
                  const firstName = fullName.split(" ")[0];
                  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
                })()}
                !
              </FormCard.Title>
            </FormCard.Header>
            <FormCard.Content className="mt-8">
              <div className="space-y-6">
                <span className="text-[16px] font-[450] text-neutral-500/70">
                  We&apos;ll review your details and reach out within 24-48
                  hours.
                </span>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Project Types
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {values.projectTypes?.map((type) => (
                        <span
                          key={type}
                          className="rounded-full bg-neutral-200/50 px-3 py-1 text-sm text-neutral-600"
                        >
                          {ProjectTypes[type]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-neutral-500">
                      Message
                    </h3>
                    <p className="text-sm text-neutral-600">{values.message}</p>
                  </div>

                  {values.link && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-neutral-500">
                        Reference Link
                      </h3>
                      <a
                        href={values.link}
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {values.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </FormCard.Content>
          </FormCard.Root>

          <Link
            href="/"
            className={cn(
              "mt-8 text-sm text-neutral-500 hover:text-neutral-700",
              "flex items-center justify-center gap-2",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </>
      ),
    },
  ];
};
