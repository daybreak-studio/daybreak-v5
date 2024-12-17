import { FormCard } from "./form-card";
import { FormCTAButton } from "./form-button";
import { ProjectTypes } from "@/lib/contact/schemas/contact-form";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/contact/schemas/contact-form";
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
                  "focus-visible: outline-white focus-visible:rounded-md focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-8",
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
    id: "personal-info",
    content: (
      <FormCard.Root>
        <FormCard.Header className="space-y-6">
          <FormCard.Navigation
            current={2}
            total={5}
            onNext={nextStep}
            onPrev={prevStep}
          />
          <FormCard.Title>Tell us about yourself</FormCard.Title>
        </FormCard.Header>
        <FormCard.Content className="mt-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Smith"
                      {...field}
                      className="w-full rounded-2xl bg-stone-900/[0.03] p-4"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jane@company.com"
                      {...field}
                      className="w-full rounded-2xl bg-stone-900/[0.03] p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormCTAButton onClick={nextStep}>Continue</FormCTAButton>
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
          <FormField
            control={form.control}
            name="projectTypes"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(ProjectTypes).map(([value, label]) => (
                    <div
                      key={value}
                      className="relative flex cursor-pointer flex-col gap-4 rounded-2xl bg-white/20 p-4 transition-colors hover:bg-white/30"
                      onClick={() => {
                        const currentValue = field.value || [];
                        const newValue = currentValue.includes(
                          value as ProjectType,
                        )
                          ? currentValue.filter((item) => item !== value)
                          : [...currentValue, value as ProjectType];
                        field.onChange(newValue);
                      }}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(value as ProjectType)}
                          className="absolute right-4 top-4"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">{label}</FormLabel>
                    </div>
                  ))}
                </div>
                <FormMessage />
                <FormCTAButton onClick={nextStep} className="mt-4" />
              </FormItem>
            )}
          />
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
                  <FormLabel>Project Details</FormLabel>
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
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Sending your message..."
                : "Let's create something amazing"}
            </FormCTAButton>
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
          <FormCard.Navigation current={5} total={5} />
          <FormCard.Title>Thank you!</FormCard.Title>
        </FormCard.Header>
        <FormCard.Content className="mt-8">
          <span className="text-[16px] font-[450] text-stone-500/70">
            Your form has been submitted. We will reach out to you shortly.
          </span>
        </FormCard.Content>
      </FormCard.Root>
    ),
  },
];
