import { z } from "zod";

export const applyStep1Schema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  age: z.string().min(1, "Âge requis"),
  country: z.string().min(1, "Pays requis"),
  whatsapp: z.string().optional(),
});

export const applyStep2Schema = z.object({
  departments: z.array(z.string()).min(1, "Sélectionnez au moins un département"),
});

export const applyStep3Schema = z.object({
  platforms: z.array(
    z.object({
      name: z.string(),
      username: z.string().optional(),
      followers: z.string().optional(),
    })
  ),
  monthlyRevenue: z.string().min(1, "Revenu requis"),
});

export const applyStep4Schema = z.object({
  goals: z.string().min(10, "Un minimum de détails (10 caractères)"),
  whyUs: z.string().min(10, "Un minimum de détails (10 caractères)"),
  blockers: z.string().min(10, "Un minimum de détails (10 caractères)"),
});

export const applySchema = applyStep1Schema
  .merge(applyStep2Schema)
  .merge(applyStep3Schema)
  .merge(applyStep4Schema);

export type ApplyData = z.infer<typeof applySchema>;
