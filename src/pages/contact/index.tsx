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

interface FormStep {
  id: string;
  content: React.ReactNode;
}

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

      nextStep();
      localStorage.removeItem("contact_form");
    } catch (error) {
      form.setError("root", { message: "Failed to submit form" });
    }
  }

  return (
    <FormProvider {...form}>
      <div className="fixed inset-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid h-screen w-screen place-items-center"
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
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1,
                  velocity: 0.5,
                  opacity: { duration: 0.1 },
                  filter: { duration: 0.2 },
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
      </div>
    </FormProvider>
  );
}
