import * as z from "zod";

export const basicInformationSchema = z.object({
  fullName: z.string().min(1, ""),
  email: z.string().email(""),
});

export type BasicInformationValues = z.infer<typeof basicInformationSchema>;

export const projectTypeSchema = z.object({
  projectTypes: z
    .array(z.enum(["brand", "web", "motion", "product"]))
    .min(1, "")
    .max(4, ""),
});

export type ProjectTypeValues = z.infer<typeof projectTypeSchema>;

export const projectDetailsSchema = z.object({
  message: z.string().min(10, "").max(200, ""),
  link: z.string().url("").optional(),
});

export type ProjectDetailsValues = z.infer<typeof projectDetailsSchema>;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name")
    .max(100, "That name seems a bit long, could you shorten it?")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }),

  email: z
    .string()
    .min(1, "We'll need your email to get back to you")
    .email("Hmm, this email address doesn't look quite right"),

  projectTypes: z
    .array(z.enum(["brand", "web", "motion", "product"]))
    .min(1, "Please select at least one project type")
    .max(
      4,
      "You've selected all project types! Maybe we should have a bigger conversation",
    ),

  message: z
    .string()
    .min(10, "Could you tell us a bit more about your project?")
    .max(
      2000,
      "We appreciate your detailed message! Could you summarize it a bit?",
    )
    .transform((message) => message.trim()),

  link: z
    .string()
    .url(
      "This link doesn't seem to work. Make sure it starts with http:// or https://",
    )
    .optional()
    .or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ProjectTypes = {
  brand: "Brand Design",
  web: "Web Design",
  motion: "Motion Design",
  product: "Product Design",
} as const;
