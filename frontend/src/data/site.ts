import { imageAssets } from "../assets/imageAssets";

export const heroSlides = [
  {
    id: 1,
    number: '01',
    role: 'Corporate Leadership',
    quoteLines: ['"Vision creates opportunity.', 'Leadership turns it', 'into lasting value"'],
    shortQuoteLines: ['"Vision creates', 'opportunity', '& lasting value"'],
    image: imageAssets.hero.image1,
    imageAlt: 'Thilanga Sumathipala - Corporate Leadership',
  },
  {
    id: 2,
    number: '02',
    role: 'Political Leadership',
    quoteLines: ['"Public service is not', 'a position to hold, but a', 'responsibility to uphold"'],
    shortQuoteLines: ['"Public service is', 'a responsibility', 'to uphold"'],
    image: imageAssets.hero.image2,
    imageAlt: 'Thilanga Sumathipala - Political Leadership',
  },
  {
    id: 3,
    number: '03',
    role: 'Sports Administration',
    quoteLines: ['"Sport builds more than', 'champions; it builds discipline,', 'unity and national pride"'],
    shortQuoteLines: ['"Sport builds discipline,', 'unity & national pride"'],
    image: imageAssets.hero.image3,
    imageAlt: 'Thilanga Sumathipala - Sports Administration',
  },
  {
    id: 4,
    number: '04',
    role: 'Public Relations & Social Service',
    quoteLines: ['"True leadership is measured', 'by the lives we uplift and', 'the hope we leave behind"'],
    shortQuoteLines: ['"Leadership is measured', 'by the lives we uplift"'],
    image: imageAssets.hero.image4,
    imageAlt: 'Thilanga Sumathipala - Public Relations',
  },
  {
    id: 5,
    number: '05',
    role: 'Visionary Leadership',
    quoteLines: ['"A nation’s stories preserve', 'its identity and inspire the', 'generations that follow"'],
    shortQuoteLines: ['"Stories preserve identity', '& inspire generations"'],
    image: imageAssets.hero.image5,
    imageAlt: 'Thilanga Sumathipala - Visionary Leadership',
  },
] as const;
