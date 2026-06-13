"use client";

import { useCallback, type MouseEvent } from "react";
import Link from "next/link";
import type { ChatAITrackingEventName } from "@/lib/tracking/chat-ai-events";

interface TrackedLinkProps {
  href: string;
  eventName: ChatAITrackingEventName;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function TrackedLink({
  href,
  eventName,
  className,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
}: TrackedLinkProps) {
  const handleClick = useCallback(() => {
    fetch("/api/chat-ai/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: eventName, payload: { href } }),
      // fire-and-forget
      keepalive: true,
    }).catch(() => {
      // silent, tracking must never break navigation
    });
  }, [eventName, href]);

  const sharedProps = {
    className,
    style,
    onClick: handleClick,
    onMouseEnter,
    onMouseLeave,
  };

  if (href.startsWith("#")) {
    return (
      <a href={href} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      {children}
    </Link>
  );
}
