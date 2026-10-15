import { imageAssets } from "../assets/imageAssets";

export const heroSlides = [
  {
    id: 1,
    number: '01',
    role: 'Corporate Leadership',
    quoteLines: ['Vision creates opportunity.', 'Leadership turns it', 'into lasting value'],
    shortQuoteLines: ['Vision creates', 'opportunity', '& lasting value'],
    image: imageAssets.hero.image1,
    imageAlt: 'Thilanga Sumathipala - Corporate Leadership',
    mobilePosition: 86,
    mobilePresentation: 'cover',
    mobileScale: 1,
  },

  {
  id: 2,
  number: '02',
  role: 'EDUCATION',
  quoteLines: [
    'Education builds knowledge.',
    'Experience shapes vision.',
    'Leadership drives progress.',
  ],
  shortQuoteLines: [
    'Knowledge builds vision.',
    'Leadership drives progress.',
  ],
  image: imageAssets.hero.image2,
  imageAlt: 'Thilanga Sumathipala - Education and Leadership',
  mobilePosition: 90,
  mobilePresentation: 'cover',
  mobileScale: 1,
},


  {
    id: 3,
    number: '03',
    role: 'Sports Administration',
    quoteLines: ['Sport builds more than', 'champions; it builds discipline,', 'unity and national pride'],
    shortQuoteLines: ['Sport builds discipline,', 'unity & national pride'],
    image: imageAssets.hero.image3,
    imageAlt: 'Thilanga Sumathipala - Sports Administration',
    mobilePosition: 56,
    mobilePresentation: 'layered',
    mobileScale: 1.6,
  },
  {
  id: 4,
  number: '04',
  role: 'VENTURES & INVESTMENTS',
  quoteLines: [
    'Investing with purpose.',
    'Building businesses',
    'for lasting value.',
  ],
  shortQuoteLines: [
    'Investing with purpose.',
    'Building lasting value.',
  ],
  image: imageAssets.hero.image4,
  imageAlt: 'Thilanga Sumathipala - Ventures and Investments',
  mobilePosition: 100,
  mobilePresentation: 'layered',
  mobileScale: 1.6,
},

  {
    id: 5,
    number: '05',
    role: 'Culture, Media & Legacy or Cultural & Media Initiatives',
    quoteLines: ['A nation’s stories preserve', 'its identity and inspire the', 'generations that follow'],
    shortQuoteLines: ['Stories preserve identity', '& inspire generations'],
    image: imageAssets.hero.image5,
    imageAlt: 'Thilanga Sumathipala - Visionary Leadership',
    mobilePosition: 91,
    mobilePresentation: 'layered',
    mobileScale: 1.6,
  },
] as const;
