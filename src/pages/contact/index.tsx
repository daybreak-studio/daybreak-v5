"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  contactFormSchema,
  ContactFormValues,
  ProjectTypes,
} from "@/lib/contact/schemas/contact-form";
import { usePersistedForm } from "@/hooks/use-persisted-form";

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      projectTypes: [],
      message: "",
      link: "",
    },
  });

  usePersistedForm(form);

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Clear form and storage
      form.reset();
      localStorage.removeItem("contact_form_data");

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
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            We&apos;d love to hear about your project. Let us know what
            you&apos;re looking to create.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s your name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
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
                  <FormLabel>What&apos;s your email?</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectTypes"
              render={() => (
                <FormItem>
                  <FormLabel>
                    What type of project are you interested in?
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {Object.entries(ProjectTypes).map(([value, label]) => (
                      <FormField
                        key={value}
                        control={form.control}
                        name="projectTypes"
                        render={({ field }) => (
                          <FormItem
                            key={value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(value as any)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  const newValue = checked
                                    ? [...currentValue, value]
                                    : currentValue.filter((v) => v !== value);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell us about your project</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your vision, goals, and any specific requirements..."
                      className="min-h-[120px]"
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
                  <FormLabel>Got a website or portfolio to share?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-website.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Share a link to your website, portfolio, or
                    inspiration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  Sending your message...
                </span>
              ) : (
                "Let's create something amazing"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
}
