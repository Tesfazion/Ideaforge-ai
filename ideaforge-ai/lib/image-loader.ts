"use client";

import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Keep the entire source URL together, including external crop parameters.
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 75),
  });

  return `/.netlify/images?${params.toString()}`;
}
