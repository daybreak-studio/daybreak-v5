"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContactFormValues,
  contactFormSchema,
} from "@/lib/contact/schemas/contact-form";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useFormAnimation } from "@/lib/hooks/use-form-animation";
import { createFormSteps } from "@/components/form/form-steps";

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
  const { getScale, getRotation, getY, getCardVisibility } = useFormAnimation();

  const formSteps = createFormSteps({
    form,
    nextStep,
    prevStep,
    onSubmit,
    copied,
    setCopied,
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      form.reset();
      nextStep(); // Move to success step

      toast({
        title: "Message sent successfully! 🎉",
        description: "We'll get back to you within 24-48 hours.",
      });
    } catch (error) {
      console.error("Submission Error:", error);
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description:
          "Please try again or email us directly at hello@daybreak.studio",
      });
    }
  }

  return (
    <FormProvider {...form}>
      <div className="fixed inset-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid h-screen w-screen place-items-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {formSteps.map((step, index) => (
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
