import { imageAssets } from "../assets/imageAssets";

export const heroSlides = [
  {
    id: 1,
    number: '01',
    role: 'Corporate Leadership',
    quote: 'Vision creates opportunity. Leadership turns it into lasting value.',
    image: imageAssets.hero.image1,
    imageAlt: 'Thilanga Sumathipala - Corporate Leadership',
  },
  {
    id: 2,
    number: '02',
    role: 'Political Leadership',
    quote: 'Public service is not a position to hold, but a responsibility to uphold.',
    image: imageAssets.hero.image2,
    imageAlt: 'Thilanga Sumathipala - Political Leadership',
  },
  {
    id: 3,
    number: '03',
    role: 'Sports Administration',
    quote: 'Sport builds more than champions; it builds discipline, unity and national pride.',
    image: imageAssets.hero.image3,
    imageAlt: 'Thilanga Sumathipala - Sports Administration',
  },
  {
    id: 4,
    number: '04',
    role: 'Public Relations & Social Service',
    quote: 'True leadership is measured by the lives we uplift and the hope we leave behind.',
    image: imageAssets.hero.image4,
    imageAlt: 'Thilanga Sumathipala - Public Relations',
  },
  {
    id: 5,
    number: '05',
    role: 'Visionary Leadership',
    quote: 'A nation’s stories preserve its identity and inspire the generations that follow.',
    image: imageAssets.hero.image5,
    imageAlt: 'Thilanga Sumathipala - Visionary Leadership',
  },
] as const;

export const practices = [
  { title: "Business law advisor", image: imageAssets.practice.businessLaw },
  {
    title: "Investment litigation",
    image: imageAssets.practice.investmentLitigation,
  },
  { title: "Trust and estates", image: imageAssets.practice.trustsAndEstates },
  {
    title: "Personal injury advisor",
    image: imageAssets.practice.personalInjury,
  },
];

export const attorneys = [
  {
    name: "Evan Thomson",
    role: "Criminal lawyer",
    image: imageAssets.attorneys.attorney1,
  },
  {
    name: "Bryan Johnson",
    role: "Family lawyer",
    image: imageAssets.attorneys.attorney2,
  },
  {
    name: "Jemmy Watson",
    role: "Corporate lawyer",
    image: imageAssets.attorneys.attorney3,
  },
  {
    name: "Jeremy Dupont",
    role: "Business lawyer",
    image: imageAssets.attorneys.attorney4,
  },
];

export const posts = [
  {
    title: "What to do if teammates do not appreciate you?",
    date: "30 March 2023",
    image: imageAssets.journal.post1,
  },
  {
    title: "Getting a consultant is the best decision.",
    date: "28 March 2023",
    image: imageAssets.journal.post2,
  },
  {
    title: "Research and strategy are vital for the market.",
    date: "26 March 2023",
    image: imageAssets.journal.post3,
  },
];
