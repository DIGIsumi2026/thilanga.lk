/**
 * Central video registry.
 *
 * Add video files to ./videos, import them in this file, and expose them
 * through videoAssets. Components/pages must never import video files directly.
 *
 * Example when a video is added:
 *   import heroIntro from './videos/hero-intro.mp4';
 *   export const videoAssets = { hero: { intro: heroIntro } } as const;
 */
export const videoAssets = {} as const;

export type VideoAssets = typeof videoAssets;
