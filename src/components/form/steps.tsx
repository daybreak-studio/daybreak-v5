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

type ProjectType = keyof typeof ProjectTypes;

interface FormStepsProps {
  form: UseFormReturn<ContactFormValues>;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: (data: ContactFormValues) => Promise<void>;
  copied: boolean;
  setCopied: (copied: boolean) => void;
}

export const createFormSteps = ({
  form,
  nextStep,
  prevStep,
  onSubmit,
  copied,
  setCopied,
}: FormStepsProps) => [
  {
    id: "welcome",
    content: (
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
            <span className="text-sm text-stone-400 md:text-lg">
              We&apos;re looking for people excited by the possibilities of
              technology, constantly exploring new means of expression and
              highly detailed in their practice.
            </span>
            <div className="flex items-center justify-between rounded-2xl border border-stone-500/10 p-4">
              <span className="text-xs text-stone-500/75 md:text-base">
                Email us:
              </span>
              <button
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl hover:cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-4",
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
                      transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
                    >
                      <span className="text-xs text-stone-500/75 md:text-base">
                        Copied to clipboard!
                      </span>
                      <ClipboardDocumentCheckIcon className="h-4 w-4 text-stone-500/75" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: EASINGS.easeInQuart }}
                    >
                      <span className="text-xs text-stone-500/75 md:text-base">
                        hello@daybreak.studio
                      </span>
                      <ClipboardDocumentIcon className="h-4 w-4 text-stone-500/75" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <FormCTAButton onClick={nextStep}>Get Started</FormCTAButton>
          </div>
        </FormCard.Content>
      </FormCard.Root>
    ),
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
                  <FormLabel className="flex items-center gap-1">
                    Full Name
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      className="rounded-2xl bg-stone-900/[0.03] p-4"
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
                  <FormLabel className="flex items-center gap-1">
                    Email
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-2xl bg-stone-900/[0.03] p-4"
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
                if (isValid) {
                  nextStep();
                }
              }}
              type="button"
              disabled={!form.getValues("fullName") || !form.getValues("email")}
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
                          render={() => (
                            <FormItem className="relative flex cursor-pointer flex-col gap-4 rounded-2xl bg-white/20 p-4 transition-colors hover:bg-white/30">
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
                                  className="absolute right-4 top-4"
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer">
                                {label}
                              </FormLabel>
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
                if (isValid) {
                  nextStep();
                }
              }}
              type="button"
              disabled={!form.getValues("projectTypes").length}
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
                      className="w-full resize-none rounded-2xl bg-stone-900/[0.03] p-4"
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
                      placeholder="https://..."
                      {...field}
                      className="w-full rounded-2xl bg-stone-900/[0.03] p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormCTAButton
              onClick={async () => {
                const isValid = await form.trigger(["message", "link"]);
                if (isValid) {
                  nextStep();
                }
              }}
              type="button"
              disabled={!form.getValues("message")}
            >
              Let&apos;s review your answers
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
                <h3 className="text-sm font-medium text-stone-500">
                  Contact Details
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-stone-600">
                    {form.watch("fullName") || "No name provided"}
                  </p>
                  <p className="text-sm text-stone-600">
                    {form.watch("email") || "No email provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500">
                  Project Types
                </h3>
                {form.watch("projectTypes").length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {form.watch("projectTypes").map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-stone-200/50 px-3 py-1 text-sm text-stone-600"
                      >
                        {ProjectTypes[type]}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-stone-500">
                    No project types selected yet. Let us know what you&apos;re
                    interested in!
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500">
                  Project Details
                </h3>
                {form.watch("message") ? (
                  <p className="text-sm text-stone-600">
                    {form.watch("message")}
                  </p>
                ) : (
                  <p className="text-sm italic text-stone-500">
                    Tell us about your vision! We&apos;d love to hear what you
                    have in mind!
                  </p>
                )}
              </div>

              {form.watch("link") && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-500">
                    Reference Link
                  </h3>
                  <a
                    href={form.watch("link")}
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {form.watch("link")}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <FormCTAButton
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  !form.getValues("fullName") ||
                  !form.getValues("email") ||
                  !form.getValues("projectTypes").length ||
                  !form.getValues("message")
                }
              >
                {form.formState.isSubmitting ? "Sending..." : "Submit"}
              </FormCTAButton>
              <button
                type="button"
                onClick={prevStep}
                className="text-sm text-stone-500 hover:text-stone-700"
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
      <FormCard.Root>
        <FormCard.Header className="space-y-6">
          <FormCard.Title>
            Thank you{" "}
            {form.getValues("fullName").split(" ")[0].charAt(0).toUpperCase() +
              form.getValues("fullName").split(" ")[0].slice(1)}
            !
          </FormCard.Title>
        </FormCard.Header>
        <FormCard.Content className="mt-8">
          <div className="space-y-6">
            <span className="text-[16px] font-[450] text-stone-500/70">
              We&apos;ll review your details and reach out within 24-48 hours.
            </span>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500">
                  Project Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {form.getValues("projectTypes").map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-stone-200/50 px-3 py-1 text-sm text-stone-600"
                    >
                      {ProjectTypes[type]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500">Message</h3>
                <p className="text-sm text-stone-600">
                  {form.getValues("message")}
                </p>
              </div>

              {form.getValues("link") && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-500">
                    Reference Link
                  </h3>
                  <a
                    href={form.getValues("link")}
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {form.getValues("link")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </FormCard.Content>
      </FormCard.Root>
    ),
  },
];
