import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "../schema";

const STORAGE_KEY = "contact_form_data";
const EXPIRY_DAYS = 7;

export function usePersistedForm(form: UseFormReturn<ContactFormValues>) {
  // Load persisted data on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { data, expiry } = JSON.parse(stored);
        if (new Date().getTime() < expiry) {
          form.reset(data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [form]);

  // Save form data on change
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (Object.keys(data).length && !form.formState.isSubmitSuccessful) {
        const expiry = new Date().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, expiry }));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Clear storage on successful submit
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [form.formState.isSubmitSuccessful]);
}
