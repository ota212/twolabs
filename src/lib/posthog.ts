import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return;

  posthog.init(key, {
    api_host: host ?? "https://us.i.posthog.com",
    capture_pageview: false, // We handle this manually for SPA navigation
    capture_pageleave: true,
    autocapture: true, // Clicks, form submissions, etc.
  });
}

export { posthog };
