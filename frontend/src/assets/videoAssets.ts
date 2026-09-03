import corporateHero from "../assets/videos/corporate-hero.mp4";







export const videoAssets = {
    corporate: {
    hero: corporateHero,
  },
} as const;

export type VideoAssets = typeof videoAssets;
