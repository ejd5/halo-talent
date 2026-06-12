import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide"),
  profile: z.string().optional(),
  subject: z.string().min(3, "Sujet requis (3 caractères minimum)"),
  message: z.string().min(10, "Message requis (10 caractères minimum)"),
  consent_contact: z.boolean().optional(),
});

export type ContactData = z.infer<typeof contactSchema>;
