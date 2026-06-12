"use client";

interface QuickQuestionsProps {
  locale?: string;
  onSelect: (question: string) => void;
}

const QUESTIONS: Record<string, string[]> = {
  fr: [
    "Mon agence refuse de me donner mon mot de passe",
    "OnlyFans a suspendu mon compte sans explication",
    "Comment contester une clause abusive ?",
    "Puis-je récupérer mes revenus bloqués ?",
    "Que faire en cas de leak de mon contenu ?",
    "Mon contrat d'agence est-il valable ?",
  ],
  en: [
    "My agency won't give me my password",
    "OnlyFans suspended my account without explanation",
    "How to challenge an unfair clause?",
    "Can I recover my blocked earnings?",
    "What to do if my content is leaked?",
    "Is my agency contract valid?",
  ],
};

export function QuickQuestions({ locale = "fr", onSelect }: QuickQuestionsProps) {
  const questions = QUESTIONS[locale] ?? QUESTIONS.fr;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
        {locale === "en" ? "Quick questions" : "Questions rapides"}
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="px-3 py-1.5 text-xs font-medium text-left transition-colors hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
