import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
  source: z.string().optional().default("footer"),
  consent_marketing: z.boolean().optional().default(false),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;
