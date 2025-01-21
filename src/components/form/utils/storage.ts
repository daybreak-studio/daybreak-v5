import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "../schema";

const STORAGE_KEY = "contact_form";

export function usePersistedForm(form: UseFormReturn<ContactFormValues>) {
  // Load form data on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        form.reset(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [form]);

  // Save form data on change
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);
}
