"use client";

import { useState } from "react";
import { Target, TrendingUp, Euro, Plus, Check, ChevronDown, Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Goal = {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  subTasks: { id: string; label: string; done: boolean }[];
};

const initialGoals: Goal[] = [
  {
    id: "g1", label: "Revenu mensuel", current: 12450, target: 15000, unit: "€", deadline: "2026-07-01",
    subTasks: [
      { id: "g1t1", label: "Augmenter le prix d'abonnement à 15€", done: true },
      { id: "g1t2", label: "Publier 2 PPV premium", done: true },
      { id: "g1t3", label: "Atteindre 500 abonnés OF", done: false },
    ],
  },
  {
    id: "g2", label: "Followers Instagram", current: 14200, target: 20000, unit: "", deadline: "2026-08-01",
    subTasks: [
      { id: "g2t1", label: "4 Reels/semaine", done: true },
      { id: "g2t2", label: "Collaborer avec 2 créateurs fitness", done: false },
      { id: "g2t3", label: "Story quotidienne", done: false },
    ],
  },
  {
    id: "g3", label: "Taux d'engagement", current: 4.7, target: 6.0, unit: "%", deadline: "2026-06-15",
    subTasks: [
      { id: "g3t1", label: "Répondre à tous les commentaires", done: false },
      { id: "g3t2", label: "Posts interactifs (sondages, questions)", done: false },
    ],
  },
  {
    id: "g4", label: "Publications / semaine", current: 3, target: 5, unit: "", deadline: "2026-06-30",
    subTasks: [
      { id: "g4t1", label: "Planifier la semaine chaque lundi", done: true },
      { id: "g4t2", label: "Préparer les visuels à l'avance", done: false },
    ],
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSubtask = (goalId: string, taskId: string) => {
    setGoals((prev) => prev.map((g) =>
      g.id === goalId ? { ...g, subTasks: g.subTasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) } : g
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Mes objectifs</h1>
          <p className="text-sm mt-1" style={{ color: "#FFFFFF" }}>Suis ta progression et ajuste ta stratégie</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80" style={{ backgroundColor: "#C75B39", color: "#FFFFFF" }}>
          <Plus size={11} /> Nouvel objectif
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);
          const isExpanded = expanded === goal.id;
          const doneTasks = goal.subTasks.filter((t) => t.done).length;

          return (
            <div key={goal.id} className="border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
              {/* Main row */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold" style={{ color: "#FFFFFF" }}>{goal.label}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 font-mono" style={{ backgroundColor: daysLeft <= 7 ? "#EF444415" : "#FFFFFF08", color: daysLeft <= 7 ? "#EF4444" : "#FFFFFF60" }}>
                      {daysLeft > 0 ? `J-${daysLeft}` : "Échéance dépassée"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono" style={{ color: "var(--color-accent)" }}>
                        {goal.current.toLocaleString("fr-FR")}{goal.unit}
                      </span>
                      <span className="text-sm mx-1" style={{ color: "#FFFFFF60" }}>/</span>
                      <span className="text-sm" style={{ color: "#FFFFFF80" }}>
                        {goal.target.toLocaleString("fr-FR")}{goal.unit}
                      </span>
                    </div>
                    <button onClick={() => setExpanded(isExpanded ? null : goal.id)}
                      className="p-1 hover:opacity-70 transition-opacity">
                      <ChevronDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} style={{ color: "#FFFFFF60" }} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-4 border border-[var(--color-border)] mt-1" style={{ backgroundColor: "var(--color-base)" }}>
                  <div className="h-full transition-all duration-700 relative overflow-hidden" style={{
                    width: `${pct}%`,
                    background: pct >= 100
                      ? "linear-gradient(90deg, #10B981, #34D399)"
                      : "linear-gradient(90deg, var(--color-accent), rgba(199,91,57,0.6))",
                  }}>
                    {pct > 15 && (
                      <span className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-mono font-bold text-white/80">
                        {pct}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-medium" style={{ color: pct >= 100 ? "#10B981" : "var(--color-accent)" }}>
                    {pct >= 100 ? "✓ Atteint" : `${pct}% atteint`}
                  </span>
                  {goal.subTasks.length > 0 && (
                    <span className="text-[10px]" style={{ color: "#FFFFFF60" }}>
                      {doneTasks}/{goal.subTasks.length} sous-tâches
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded: sub-tasks */}
              {isExpanded && (
                <div className="border-t border-[var(--color-border)] px-5 py-3 space-y-2" style={{ backgroundColor: "var(--color-base)" }}>
                  <p className="text-[10px] uppercase tracking-wider font-medium mb-2" style={{ color: "#FFFFFF60" }}>Sous-tâches</p>
                  {goal.subTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleSubtask(goal.id, task.id)}
                      className="flex items-center gap-2.5 w-full text-left py-1 group"
                    >
                      <div className={cn(
                        "w-4 h-4 border flex items-center justify-center transition-all shrink-0",
                        task.done ? "border-[#10B981] bg-[#10B981]" : "border-[var(--color-border)] group-hover:border-[#C75B39]/50"
                      )}>
                        {task.done && <Check size={10} className="text-white" />}
                      </div>
                      <span className={cn("text-xs", task.done && "line-through")} style={{ color: task.done ? "#FFFFFF60" : "#FFFFFF" }}>
                        {task.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
