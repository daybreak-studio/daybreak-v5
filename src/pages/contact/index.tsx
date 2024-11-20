import { ContactForm } from "./components/contact-form";
import { Toaster } from "@/components/ui/toaster";

export default function ContactPage() {
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

        <ContactForm />
      </div>

      <Toaster />
    </div>
  );
}
