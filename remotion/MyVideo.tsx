import {
  AbsoluteFill,
  Sequence,
  Video as RemotionVideo,
  Audio,
  useVideoConfig,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import type { Track, Clip, AspectRatio } from "../app/(private)/studio/edit/video/components/editor-types";
import { FPS, ASPECT_RATIOS } from "../app/(private)/studio/edit/video/components/editor-types";
import { TextOverlay } from "./TextOverlay";
import { ImageOverlay } from "./ImageOverlay";

interface Scene {
  type: string;
  startFrame: number;
  duration: number;
  src?: string;
  props: Record<string, unknown>;
  animation?: string;
}

interface Props {
  scenes: Scene[];
  aspectRatio: AspectRatio;
}

const TransitionLayer: React.FC<{
  children: React.ReactNode;
  transition?: "fade" | "slide" | "dissolve" | "none";
  durationFrames: number;
}> = ({ children, transition = "none", durationFrames }) => {
  const frame = useCurrentFrame();
  if (transition === "none") return <>{children}</>;

  const opacity = interpolate(frame, [0, Math.min(15, durationFrames / 2)], [0, 1]);

  return <div style={{ opacity, width: "100%", height: "100%" }}>{children}</div>;
};

export const MyVideo: React.FC<Props> = ({ scenes, aspectRatio }) => {
  const { width, height } = useVideoConfig();
  const ar = ASPECT_RATIOS.find((a) => a.value === aspectRatio)!;

  const videoTracks = scenes.filter((s) => s.type === "video" || s.type === "image" || s.type === "text");
  const audioTracks = scenes.filter((s) => s.type === "audio");

  return (
    <AbsoluteFill
      style={{
        width: ar.w,
        height: ar.h,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {videoTracks.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.startFrame}
          durationInFrames={scene.duration}
        >
          <TransitionLayer
            transition={(scene.props.transition as "fade" | "slide" | "dissolve" | "none") || "none"}
            durationFrames={scene.duration}
          >
            {scene.type === "text" && (
              <TextOverlay
                text={scene.props.text as string}
                x={scene.props.x as number}
                y={scene.props.y as number}
                fontSize={scene.props.fontSize as number}
                fontFamily={scene.props.fontFamily as string}
                fontWeight={scene.props.fontWeight as string}
                color={scene.props.color as string}
                opacity={scene.props.opacity as number}
              />
            )}
            {scene.type === "image" && scene.src && (
              <ImageOverlay
                src={scene.src}
                x={scene.props.x as number}
                y={scene.props.y as number}
                width={scene.props.width as number}
                height={scene.props.height as number}
                opacity={scene.props.opacity as number}
                animation={scene.animation as any}
                durationFrames={scene.duration}
              />
            )}
            {scene.type === "video" && scene.src && (
              <RemotionVideo
                src={scene.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: ((scene.props.opacity as number) ?? 100) / 100,
                }}
              />
            )}
          </TransitionLayer>
        </Sequence>
      ))}

      {audioTracks.map((scene, i) => (
        <Sequence key={`audio-${i}`} from={scene.startFrame} durationInFrames={scene.duration}>
          {scene.src && <Audio src={scene.src} volume={(scene.props.volume as number) ?? 1} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export function buildScenesFromTracks(tracks: Track[], aspectRatio: AspectRatio): Scene[] {
  const scenes: Scene[] = [];
  for (const track of tracks) {
    if (!track.visible) continue;
    for (const clip of track.clips) {
      const scene: Scene = {
        type: clip.type,
        startFrame: clip.startFrame,
        duration: clip.durationFrames,
        src: clip.src,
        props: { ...clip.props },
        animation: clip.props.animation,
      };
      scenes.push(scene);
    }
  }
  return scenes;
}
