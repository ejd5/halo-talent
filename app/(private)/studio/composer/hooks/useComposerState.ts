"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import type {
  ComposerState,
  ComposerAction,
  PlatformType,
  PlatformSubType,
  PublishRequest,
  PublishResponse,
} from "@/lib/studio/types";

const DRAFT_KEY = "composer-draft-current";

function createInitialState(): ComposerState {
  return {
    platforms: [],
    media: [],
    caption: { text: "", hashtags: [], mentions: [] },
    config: {
      scheduledAt: null,
      visibility: "public",
      geo: null,
    },
    activeTab: "content",
    isDirty: false,
    lastSaved: null,
    publishStatus: "idle",
    draftId: null,
    sourceMetadata: null,
  };
}

function composerReducer(state: ComposerState, action: ComposerAction): ComposerState {
  switch (action.type) {
    case "TOGGLE_PLATFORM": {
      const exists = state.platforms.find((p) => p.platform === action.platform);
      if (exists) {
        return {
          ...state,
          isDirty: true,
          platforms: state.platforms.filter((p) => p.platform !== action.platform),
        };
      }
      return {
        ...state,
        isDirty: true,
        platforms: [
          ...state.platforms,
          { platform: action.platform, subType: "post" as PlatformSubType, enabled: true },
        ],
      };
    }
    case "SET_PLATFORM_SUBTYPE":
      return {
        ...state,
        isDirty: true,
        platforms: state.platforms.map((p) =>
          p.platform === action.platform ? { ...p, subType: action.subType } : p
        ),
      };
    case "SET_MEDIA":
      return { ...state, isDirty: true, media: action.media };
    case "ADD_MEDIA":
      return { ...state, isDirty: true, media: [...state.media, action.media] };
    case "REMOVE_MEDIA":
      return { ...state, isDirty: true, media: state.media.filter((m) => m.id !== action.id) };
    case "SET_CAPTION_TEXT":
      return { ...state, isDirty: true, caption: { ...state.caption, text: action.text } };
    case "SET_HASHTAGS":
      return { ...state, isDirty: true, caption: { ...state.caption, hashtags: action.hashtags } };
    case "SET_MENTIONS":
      return { ...state, isDirty: true, caption: { ...state.caption, mentions: action.mentions } };
    case "SET_CONFIG":
      return { ...state, isDirty: true, config: { ...state.config, ...action.config } };
    case "SET_SCHEDULED_AT":
      return { ...state, isDirty: true, config: { ...state.config, scheduledAt: action.scheduledAt } };
    case "SET_VISIBILITY":
      return { ...state, isDirty: true, config: { ...state.config, visibility: action.visibility } };
    case "SET_GEO":
      return { ...state, isDirty: true, config: { ...state.config, geo: action.geo } };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.activeTab };
    case "SET_DIRTY":
      return { ...state, isDirty: true };
    case "SET_SAVED":
      return { ...state, isDirty: false, lastSaved: action.lastSaved };
    case "SET_PUBLISH_STATUS":
      return { ...state, publishStatus: action.publishStatus };
    case "SET_DRAFT_ID":
      return { ...state, draftId: action.draftId };
    case "SET_SOURCE_METADATA":
      return { ...state, isDirty: true, sourceMetadata: action.sourceMetadata };
    case "RESET":
      return createInitialState();
    case "LOAD_DRAFT":
      return { ...createInitialState(), ...action.draft, isDirty: false };
    default:
      return state;
  }
}

export function useComposerState() {
  const [state, dispatch] = useReducer(composerReducer, undefined, createInitialState);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_DRAFT", draft: parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Auto-save every 30s when dirty
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      const s = stateRef.current;
      if (!s.isDirty) return;
      try {
        const toSave = {
          platforms: s.platforms,
          caption: s.caption,
          config: {
            ...s.config,
            scheduledAt: s.config.scheduledAt ? s.config.scheduledAt.toISOString() : null,
          },
          activeTab: s.activeTab,
          draftId: s.draftId,
          sourceMetadata: s.sourceMetadata,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
        dispatch({ type: "SET_SAVED", lastSaved: new Date() });
      } catch {
        // storage full or unavailable
      }
    }, 30000);

    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, []);

  const publish = useCallback(async () => {
    dispatch({ type: "SET_PUBLISH_STATUS", publishStatus: "publishing" });
    try {
      const body: PublishRequest = {
        platforms: state.platforms.map((p) => ({ platform: p.platform, subType: p.subType })),
        media: state.media.map((m) => ({
          previewUrl: m.previewUrl,
          type: m.type,
          name: m.name,
        })),
        caption: state.caption,
        config: state.config,
      };

      const res = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: PublishResponse = await res.json();
      dispatch({ type: "SET_PUBLISH_STATUS", publishStatus: data.success ? "done" : "error" });
      return data;
    } catch {
      dispatch({ type: "SET_PUBLISH_STATUS", publishStatus: "error" });
      return { success: false, results: [], failed: [] };
    }
  }, [state.platforms, state.media, state.caption, state.config]);

  const saveDraft = useCallback(() => {
    const s = stateRef.current;
    try {
      const toSave = {
        platforms: s.platforms,
        media: s.media.map((m) => ({
          id: m.id,
          previewUrl: m.previewUrl,
          type: m.type,
          mediaId: m.mediaId,
          name: m.name,
        })),
        caption: s.caption,
        config: {
          ...s.config,
          scheduledAt: s.config.scheduledAt ? s.config.scheduledAt.toISOString() : null,
        },
        activeTab: s.activeTab,
        draftId: s.draftId,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      dispatch({ type: "SET_SAVED", lastSaved: new Date() });
    } catch {
      // storage full
    }
  }, []);

  const resetDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return { state, dispatch, publish, saveDraft, resetDraft };
}
