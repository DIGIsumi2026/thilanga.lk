//navigation bar 
import brandLogo from "../assets/images/brand-logo.png";

//hero section
import heroImage1 from "../assets/images/hero/image1.png";
import heroImage2 from "../assets/images/hero/image2.png";
import heroImage3 from "../assets/images/hero/image3.png";
import heroImage4 from "../assets/images/hero/image4.png";
import heroImage5 from "../assets/images/hero/image5.jpg";

//hero - accordian 
import accordionCorporate from "../assets/images/hero/accordion/corporate.png";
import accordionPolitical from "../assets/images/hero/accordion/political.png";
import accordionPublicRelations from "../assets/images/hero/accordion/public-relations.png";

//home - quote
import quoteBackground from "../assets/images/hero/quote/quote-background.png";

//about page 
//hero 
import aboutHero from "../assets/images/about/about-hero.png";

//family image 
import aboutFanily from "../assets/images/about/about-family.png";
//contact cta
import aboutContactCta from "./images/about/contact-cta.png";

//corporate page
//hero
import corporateThumbnail from "../assets/images/corporate/corporate-thumnail.png";

//intro
import corporateChairmanBackground from "../assets/images/corporate/chairman-background.png";

//company logos 
import company01Logo from "../assets/images/corporate/companies/company-01-logo.webp";
import company01Preview from "../assets/images/corporate/companies/previews/company-01-preview.webp";

import company02Logo from "../assets/images/corporate/companies/company-02-logo.webp";
import company02Preview from "../assets/images/corporate/companies/previews/company-02-preview.webp";

import company03Logo from "../assets/images/corporate/companies/company-03-logo.webp";
import company04Logo from "../assets/images/corporate/companies/company-04-logo.webp";
import company05Logo from "../assets/images/corporate/companies/company-05-logo.webp";

import company06Logo from "../assets/images/corporate/companies/company-06-logo.webp";
import company06Preview from "../assets/images/corporate/companies/previews/company-06-preview.webp";

import company07Logo from "../assets/images/corporate/companies/company-07-logo.webp";

import company08Logo from "../assets/images/corporate/companies/company-08-logo.webp";
import company08Preview from "../assets/images/corporate/companies/previews/company-08-preview.webp";

import company09Logo from "../assets/images/corporate/companies/company-09-logo.webp";

import company10Logo from "../assets/images/corporate/companies/company-10-logo.webp";
import company10Preview from "../assets/images/corporate/companies/previews/company-10-preview.webp";

import company11Logo from "../assets/images/corporate/companies/company-11-logo.webp";
import company12Logo from "../assets/images/corporate/companies/company-12-logo.webp";
import company13Logo from "../assets/images/corporate/companies/company-13-logo.webp";

import company14Logo from "../assets/images/corporate/companies/company-14-logo.webp";
import company14Preview from "../assets/images/corporate/companies/previews/company-14-preview.webp";

import company15Logo from "../assets/images/corporate/companies/company-15-logo.webp";
import company15Preview from "../assets/images/corporate/companies/previews/company-15-preview.webp";



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
  },

  home: {
    accordion: {
      corporate: accordionCorporate,
      political: accordionPolitical,
      publicRelations: accordionPublicRelations,
    },
    quote:{
      background: quoteBackground,
    },
  },


  about: {
    hero: aboutHero,
    family: aboutFanily,
    contactCta: aboutContactCta
  },

  corporate:{
    hero:{
      thumbnail: corporateThumbnail,
    },
    chairman:{
      background: corporateChairmanBackground,
    },

    companies: {
    company01: {
      logo: company01Logo,
      preview: company01Preview
    },

    company02: {
      logo:company02Logo,
      preview: company02Preview,
    },

    company03: {
      logo: company03Logo,
    },

    company04: {
      logo: company04Logo,
    },

    company05: {
      logo: company05Logo,
    },

    company06: {
      logo: company06Logo,
      preview: company06Preview,
    },

    company07: {
      logo: company07Logo,
    },

    company08: {
      logo: company08Logo,
      preview: company08Preview,
    },

    company09: {
      logo: company09Logo,
    },

    company10: {
      logo: company10Logo,
      preview: company10Preview,
    },

    company11: {
      logo: company11Logo,
    },

    company12: {
      logo: company12Logo,
    },

    company13: {
      logo: company13Logo,
    },

    company14: {
      logo: company14Logo,
      preview: company14Preview,
    },

    company15: {
      logo: company15Logo,
      preview: company15Preview,
    },
  },
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
