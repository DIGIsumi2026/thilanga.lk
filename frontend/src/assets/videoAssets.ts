import corporateHero from "../assets/videos/corporate-hero.mp4";
import  dambullaTimelapse  from "../assets/videos/dambulla-stadium-timelapse.mp4";







export const videoAssets = {
    corporate: {
    hero: corporateHero,
  },
  
  dambulla: {
    timelapse:dambullaTimelapse,
  },
} as const;

export type VideoAssets = typeof videoAssets;
