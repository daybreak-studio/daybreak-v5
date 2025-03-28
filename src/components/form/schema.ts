import * as z from "zod";

export const ProjectTypes = {
  brand: "Brand & Identity",
  web: "Web Development",
  motion: "Motion & Animation",
  product: "Product Design",
} as const;

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectTypes: z.array(z.enum(["brand", "web", "motion", "product"])),
  message: z.string().min(10, "Message is too short"),
  link: z
    .string()
    .regex(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/, "Please enter a valid domain")
    .optional()
    .or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
