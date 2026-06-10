import { z } from "zod";

export const AnalyzeLegalSchema = z.object({
  platform: z.string().min(1, "La plateforme est requise"),
  clauses_checked: z.array(z.string()).min(1, "Au moins une clause doit être sélectionnée"),
  other_clause_text: z.string().optional(),
  agency_name: z.string().optional(),
  language: z.string().optional(),
});

export type AnalyzeLegalInput = z.infer<typeof AnalyzeLegalSchema>;
