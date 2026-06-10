// ─── Side panel router — Halo Companion ───────────

import { useState, useCallback } from "react";
import { useCompanionStore } from "./stores/companion-store";
import { DashboardPage } from "./pages/DashboardPage";
import { FanProfilePage } from "./pages/FanProfilePage";
import { ChatAssistPage } from "./pages/ChatAssistPage";
import { VaultPage } from "./pages/VaultPage";
import { ScriptsPage } from "./pages/ScriptsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { OnboardingPage } from "./pages/OnboardingPage";

export type Route =
  | "dashboard"
  | "fan-profile"
  | "chat-assist"
  | "vault"
  | "scripts"
  | "analytics"
  | "settings"
  | "onboarding";

export interface RouteState {
  route: Route;
  params?: Record<string, string>;
}

export function Router() {
  const hasCompletedOnboarding = useCompanionStore((s) => s.hasCompletedOnboarding);
  const [route, setRoute] = useState<RouteState>({
    route: hasCompletedOnboarding ? "dashboard" : "onboarding",
  });

  const navigate = useCallback((to: Route | RouteState, params?: Record<string, string>) => {
    if (typeof to === "string") {
      setRoute({ route: to, params });
    } else {
      setRoute(to);
    }
  }, []);

  const { route: currentRoute, params } = route;

  switch (currentRoute) {
    case "dashboard":
      return <DashboardPage navigate={navigate} />;
    case "fan-profile":
      return <FanProfilePage fanId={params?.fanId} tab={params?.tab} navigate={navigate} />;
    case "chat-assist":
      return <ChatAssistPage navigate={navigate} />;
    case "vault":
      return <VaultPage navigate={navigate} />;
    case "scripts":
      return <ScriptsPage navigate={navigate} />;
    case "analytics":
      return <AnalyticsPage navigate={navigate} />;
    case "settings":
      return <SettingsPage navigate={navigate} />;
    case "onboarding":
      return <OnboardingPage navigate={navigate} />;
    default:
      return <DashboardPage navigate={navigate} />;
  }
}
