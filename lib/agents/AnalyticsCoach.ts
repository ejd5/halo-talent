import { Agent } from "./base/Agent";
import type { Tool } from "./base/types";
import { getCreatorProfile, getCreatorRevenues, getCreatorAccounts, getCreatorGoals } from "./base/tools/database";
import { getPlatformInsights } from "./base/tools/platforms";
import { getContentHistory } from "./base/tools/content";
import {
  calculateMonthlyGrowth,
  generatePerformanceReport,
  predictNextMonthRevenue,
  analyzeBestPostingTimes,
  compareToPreviousPeriod,
  identifyTopPerformers,
  detectAnomalies,
  generateReport,
  benchmarkAgainstPeers,
} from "./base/tools/analytics";

export class AnalyticsCoach extends Agent {
  getName(): string {
    return "Analytics Coach";
  }

  getSystemPrompt(): string {
    return `Tu es l'"Analytics Coach" du créateur. Ta mission : analyser ses données et lui révéler des insights actionnables.

TON RÔLE :
1. Analyser les revenus, leur évolution, les sources
2. Identifier les contenus les plus performants
3. Détecter des tendances (positives ET négatives)
4. Comparer aux benchmarks (industrie, ses pairs)
5. Recommander des optimisations basées sur la data

TON STYLE :
- Factuel et précis (toujours citer les chiffres)
- Pédagogue (expliquer ce que les chiffres veulent dire)
- Encourageant sur les succès, honnête sur les baisses
- Toujours proposer une action concrète

TU AS ACCÈS À TOUS LES DATAS DU CRÉATEUR via tes tools. Utilise-les abondamment.`;
  }

  getTools(): Tool[] {
    return [
      getCreatorProfile,
      getCreatorRevenues,
      getCreatorAccounts,
      getCreatorGoals,
      getPlatformInsights,
      getContentHistory,
      calculateMonthlyGrowth,
      generatePerformanceReport,
      predictNextMonthRevenue,
      analyzeBestPostingTimes,
      compareToPreviousPeriod,
      identifyTopPerformers,
      detectAnomalies,
      generateReport,
      benchmarkAgainstPeers,
    ];
  }

  async runProactiveTask(taskName: string): Promise<void> {
    switch (taskName) {
      case "weekly_report":
        await this.generateWeeklyReport();
        break;
      case "detect_anomalies":
        await this.detectRevenueAnomalies();
        break;
    }
  }

  private async generateWeeklyReport() {
    await this.chat("Génère mon rapport hebdomadaire avec les chiffres clés de la semaine.");
  }

  private async detectRevenueAnomalies() {
    await this.chat("Vérifie s'il y a des anomalies dans mes revenus récents.");
  }
}
