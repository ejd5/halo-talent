"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useComposerState } from "./hooks/useComposerState";
import { PlatformSelector } from "./components/PlatformSelector";
import { ContentTab } from "./components/ContentTab";
import { CaptionTab } from "./components/CaptionTab";
import { ConfigTab } from "./components/ConfigTab";
import { PreviewPanel } from "./components/PreviewPanel";
import { PublishFooter } from "./components/PublishFooter";
import { Sparkles, Music2, Hash } from "lucide-react";

export default function ComposerPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><span className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>Chargement...</span></div>}>
      <ComposerContent />
    </Suspense>
  );
}

function ComposerContent() {
  const searchParams = useSearchParams();
  const { state, dispatch, publish, saveDraft, resetDraft } = useComposerState();
  const [loadingSource, setLoadingSource] = useState(false);

  // Detect TikTok Creative Lab source params
  useEffect(() => {
    const source = searchParams.get("source");
    if (source !== "tiktok") return;

    const hashtag = searchParams.get("hashtag");
    const songId = searchParams.get("song_id");
    const type = searchParams.get("type") || "video";

    // Set source metadata
    dispatch({
      type: "SET_SOURCE_METADATA",
      sourceMetadata: {
        source: "tiktok_creative_lab",
        type: songId ? "song" : "hashtag",
        hashtag: hashtag || undefined,
        song_id: songId || undefined,
        song_title: searchParams.get("artist") || undefined,
        artist: searchParams.get("artist") || undefined,
        region: searchParams.get("region") || undefined,
      },
    });

    // Enable TikTok platform
    dispatch({ type: "TOGGLE_PLATFORM", platform: "tiktok" });

    // Pre-fill hashtag in caption
    if (hashtag) {
      dispatch({ type: "SET_CAPTION_TEXT", text: `Check this out! #${hashtag}` });
      dispatch({ type: "SET_HASHTAGS", hashtags: [hashtag] });
    }

    // Fetch song details if song_id provided
    if (songId) {
      setLoadingSource(true);
      fetch(`/api/trends/tiktok/details?song_id=${encodeURIComponent(songId)}&region=${searchParams.get("region") || "FR"}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.song) {
            const song = data.song;
            dispatch({
              type: "SET_SOURCE_METADATA",
              sourceMetadata: {
                source: "tiktok_creative_lab",
                type: "song",
                hashtag: hashtag || undefined,
                song_id: songId,
                song_title: song.title,
                artist: song.author,
                region: searchParams.get("region") || undefined,
              },
            });
            dispatch({ type: "SET_CAPTION_TEXT", text: `${song.title} — essayez ce son ! #${hashtag || song.title.replace(/\s+/g, "")}` });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSource(false));
    }

    // Clear URL params after reading them (don't re-trigger on unmount)
    window.history.replaceState({}, "", "/studio/composer");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Platform selector (320px) */}
        <div className="w-80 shrink-0 overflow-y-auto">
          <PlatformSelector
            platforms={state.platforms}
            onToggle={(platform) => dispatch({ type: "TOGGLE_PLATFORM", platform })}
            onSubtypeChange={(platform, subType) =>
              dispatch({ type: "SET_PLATFORM_SUBTYPE", platform, subType })
            }
          />
        </div>

        {/* Center — Content workspace (flexible) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TikTok source banner */}
          {state.sourceMetadata && (
            <div className="flex items-center gap-2 px-4 pt-3 pb-1" style={{ borderBottom: "1px solid rgba(199,91,57,0.15)" }}>
              <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
                <Sparkles size={10} />
                TikTok Creative Lab
              </div>
              {state.sourceMetadata.song_title && (
                <div className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                  <Music2 size={8} />
                  {state.sourceMetadata.song_title}
                </div>
              )}
              {state.sourceMetadata.hashtag && (
                <div className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                  <Hash size={8} />
                  #{state.sourceMetadata.hashtag}
                </div>
              )}
              {loadingSource && (
                <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>Chargement...</span>
              )}
            </div>
          )}

          {/* Tab Bar */}
          <div className="flex gap-0 px-4 pt-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["content", "caption", "config"] as const).map((tab) => {
              const labels = { content: "Contenu", caption: "Caption", config: "Configuration" };
              const isActive = state.activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => dispatch({ type: "SET_ACTIVE_TAB", activeTab: tab })}
                  className="px-4 py-2 text-[11px] uppercase tracking-wider transition-all relative"
                  style={{
                    color: isActive ? "#C75B39" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {labels[tab]}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: "#C75B39" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {state.activeTab === "content" && (
            <ContentTab
              media={state.media}
              onAddMedia={(m) => dispatch({ type: "ADD_MEDIA", media: m })}
              onRemoveMedia={(id) => dispatch({ type: "REMOVE_MEDIA", id })}
              onSetMedia={(media) => dispatch({ type: "SET_MEDIA", media })}
            />
          )}
          {state.activeTab === "caption" && (
            <CaptionTab
              caption={state.caption}
              platforms={state.platforms}
              onCaptionChange={(text) => dispatch({ type: "SET_CAPTION_TEXT", text })}
              onHashtagsChange={(hashtags) => dispatch({ type: "SET_HASHTAGS", hashtags })}
              onMentionsChange={(mentions) => dispatch({ type: "SET_MENTIONS", mentions })}
            />
          )}
          {state.activeTab === "config" && (
            <ConfigTab
              config={state.config}
              onSetScheduledAt={(scheduledAt) => dispatch({ type: "SET_SCHEDULED_AT", scheduledAt })}
              onSetVisibility={(visibility) => dispatch({ type: "SET_VISIBILITY", visibility })}
              onSetGeo={(geo) => dispatch({ type: "SET_GEO", geo })}
              onSetConfig={(config) => dispatch({ type: "SET_CONFIG", config })}
            />
          )}
        </div>

        {/* Right — Preview panel (340px) */}
        <div className="w-85 shrink-0 overflow-y-auto">
          <PreviewPanel
            platforms={state.platforms}
            media={state.media}
            caption={state.caption}
            config={state.config}
          />
        </div>
      </div>

      {/* Footer */}
      <PublishFooter
        isDirty={state.isDirty}
        lastSaved={state.lastSaved}
        hasPlatforms={state.platforms.length > 0}
        hasMedia={state.media.length > 0}
        publishStatus={state.publishStatus}
        onSaveDraft={saveDraft}
        onSchedule={() => {
          dispatch({ type: "SET_ACTIVE_TAB", activeTab: "config" });
        }}
        onPublish={publish}
        onTest={() => {
          dispatch({ type: "SET_PUBLISH_STATUS", publishStatus: "publishing" });
          setTimeout(() => dispatch({ type: "SET_PUBLISH_STATUS", publishStatus: "done" }), 2000);
        }}
      />
    </div>
  );
}
