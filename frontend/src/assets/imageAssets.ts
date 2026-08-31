//navigation bar 
import brandLogo from "../assets/images/brand-logo.png";

//hero section
import heroImage1 from "../assets/images/hero/image1.png";
import heroImage2 from "../assets/images/hero/image2.png";
import heroImage3 from "../assets/images/hero/image3.png";
import heroImage4 from "../assets/images/hero/image4.png";
import heroImage5 from "../assets/images/hero/image5.jpg";


import hero1 from "./images/hero-1.jpg";
import hero2 from "./images/hero-2.jpg";
import hero3 from "./images/hero-3.jpg";
import hero4 from "./images/hero-4.jpg";

import about from "./images/about.jpg";
import innerAbout from "./images/inner-about.jpg";
import consultancy from "./images/consultancy.jpg";
import attorneysStrip from "./images/attorneys-strip.jpg";

import practice1 from "./images/practice-1.jpg";
import practice2 from "./images/practice-2.jpg";
import practice3 from "./images/practice-3.jpg";
import practice4 from "./images/practice-4.jpg";

import attorney1 from "./images/attorney-1.jpg";
import attorney2 from "./images/attorney-2.jpg";
import attorney3 from "./images/attorney-3.jpg";
import attorney4 from "./images/attorney-4.jpg";

import blog1 from "./images/blog-1.jpg";
import blog2 from "./images/blog-2.jpg";
import blog3 from "./images/blog-3.jpg";

/**
 * Central image registry.
 * Components/pages must import images only from this file.
 * Add new physical image files to ./images and register them here.
 */
export const imageAssets = {
  brand:{
    logo: brandLogo,
  },
  hero:{
    image1: heroImage1,
    image2: heroImage2,
    image3: heroImage3,
    image4: heroImage4,
    image5: heroImage5,
    slide1: hero1,
    slide2: hero2,
    slide3: hero3,
    slide4: hero4,
  },

  about: {
    overview: about,
    inner: innerAbout,
  },
  practice: {
    businessLaw: practice1,
    investmentLitigation: practice2,
    trustsAndEstates: practice3,
    personalInjury: practice4,
  },
  attorneys: {
    attorney1,
    attorney2,
    attorney3,
    attorney4,
    strip: attorneysStrip,
  },
  journal: {
    post1: blog1,
    post2: blog2,
    post3: blog3,
  },
  consultancy,
} as const;

export type ImageAssets = typeof imageAssets;
