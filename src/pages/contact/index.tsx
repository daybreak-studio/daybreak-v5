import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormValues, contactFormSchema } from "@/components/form/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createFormSteps } from "@/components/form";
import {
  getScale,
  getRotation,
  getY,
  getCardVisibility,
} from "@/components/form/utils/animations";
import { usePersistedForm } from "@/components/form/utils/storage";
import { EASINGS } from "@/components/animations/easings";

interface FormStep {
  id: string;
  content: React.ReactNode;
}

// Add animation variants at the top
const FORM_ANIMATION = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: EASINGS.easeOutQuart,
    },
  },
} as const;

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      projectTypes: [],
      message: "",
      link: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  usePersistedForm(form);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const formSteps = createFormSteps({
    form,
    nextStep,
    prevStep,
    onSubmit,
    setCurrentStep,
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      // Just handle form cleanup, no navigation
      localStorage.removeItem("contact_form");
    } catch (error) {
      form.setError("root", { message: "Failed to submit form" });
    }
  }

  return (
    <FormProvider {...form}>
      <motion.div
        className="fixed inset-0"
        initial="hidden"
        animate="visible"
        variants={FORM_ANIMATION}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <AnimatePresence initial={false}>
            {formSteps.map((step: FormStep, index: number) => (
              <motion.div
                key={step.id}
                initial={{
                  opacity: 0,
                  rotate: getRotation(index, currentStep),
                  scale: getScale(index, currentStep),
                  y: getY(index, currentStep),
                  filter: `blur(${getCardVisibility(index, currentStep).blur}px)`,
                }}
                animate={{
                  opacity: getCardVisibility(index, currentStep).opacity,
                  rotate: getRotation(index, currentStep),
                  scale: getScale(index, currentStep),
                  y: getY(index, currentStep),
                  filter: `blur(${getCardVisibility(index, currentStep).blur}px)`,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  filter: "blur(10px)",
                  transition: {
                    duration: 0.6,
                    ease: EASINGS.easeOutQuart,
                  },
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1,
                  velocity: 0.5,
                  opacity: { duration: 0.6 },
                  filter: { duration: 0.6 },
                }}
                style={{
                  position: "absolute",
                  pointerEvents: currentStep === index ? "auto" : "none",
                  zIndex: index,
                }}
              >
                {step.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </form>
      </motion.div>
    </FormProvider>
  );
}
