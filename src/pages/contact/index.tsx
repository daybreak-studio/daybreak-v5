"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormValues, contactFormSchema } from "@/components/form/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { createFormSteps } from "@/components/form";
import {
  getScale,
  getRotation,
  getY,
  getCardVisibility,
} from "@/components/form/utils/animations";

interface FormStep {
  id: string;
  content: React.ReactNode;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
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
  });

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const formSteps = createFormSteps({
    form,
    nextStep,
    prevStep,
    onSubmit,
    copied,
    setCopied,
  });

  const restartForm = () => {
    form.reset();
    setCurrentStep(0);
  };

  async function onSubmit(data: ContactFormValues) {
    console.log("onSubmit handler executing with data:", data);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (!response.ok) throw new Error("Failed to submit form");

      nextStep();
      toast({
        title: "Success!",
        description: "We'll get back to you soon.",
      });
    } catch (error) {
      console.error("API Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      });
    }
  }

  return (
    <FormProvider {...form}>
      <div className="fixed inset-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("Form submit event triggered");

            try {
              // Get the form data
              const data = form.getValues();
              console.log("Form data:", data);

              // Validate the form
              const isValid = await form.trigger();
              console.log("Form validation:", isValid);

              if (!isValid) {
                console.log("Form validation failed");
                return;
              }

              // Submit the form
              await onSubmit(data);
            } catch (error) {
              console.error("Form submission error:", error);
            }
          }}
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
        <Toaster />
      </div>
    </FormProvider>
  );
}
