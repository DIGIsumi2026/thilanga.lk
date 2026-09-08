import {imageAssets} from '../assets/imageAssets';

export type CorporateCompanyPreview = {
  image?:string;
  title:string;
  subtitle?:string;
  description?:string;
  metric?:string;
};

export type CorporateCompany = {
  id:string;
  name:string;
  logo?:string;
  logoText?:string;
  href?:string | null;
  preview?:CorporateCompanyPreview | null;
};

export const corporateCompanies:CorporateCompany[] = [
  {
    id:'company-01',
    name:'Company01',
    logo:imageAssets.corporate.companies.company01.logo,
    href:'https://octagonforce.com/',
    preview:{
      image:imageAssets.corporate.companies.company01.preview,
      metric:'06+',
      title:'Deployment sectors',
      description:'Professional security, cleaning, logistics, transport, and facility support solutions delivered with discipline and reliability.',
    },
  },
  {
    id:'company-02',
    name:'Company2',
    logo:imageAssets.corporate.companies.company02.logo,
    href:'https://thi.lk/',
    preview:{
      image:imageAssets.corporate.companies.company02.preview,
      metric:'THi.lk',
      title:'Tech Without Limits',
      description:'A trusted Sri Lankan online electronics store offering authentic global brands, competitive prices, secure payments, island-wide delivery, and reliable after-sales service.',
    },
  },
  {
    id:'company-03',
    name:'Company03',
    logo:imageAssets.corporate.companies.company03.logo,
    href:null,
    preview:null,
  },

  {
    id:'company-04',
    name:'Company04',
    logo:imageAssets.corporate.companies.company04.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-05',
    name:'Company05',
    logo:imageAssets.corporate.companies.company05.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-06',
    name:'Company06',
    logo:imageAssets.corporate.companies.company06.logo,
    href:'https://octagon.lk/',
    preview:{
      image:imageAssets.corporate.companies.company06.preview,
      metric:'70+',
      title:'Years of Experience',
      description:'Reliable Engineering Solutions Built on Experience and Precision.',
    },
  },
  {
    id:'company-07',
    name:'Company07',
    logo:imageAssets.corporate.companies.company07.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-08',
    name:'Company08',
    logo:imageAssets.corporate.companies.company08.logo,
    href:'https://napco.lk/',
    preview:{
      image:imageAssets.corporate.companies.company08.preview,
      metric:'17+',
      title:'Years of Excellence',
      description:'NAPCO offers complete printing solutions across a broad spectrum of Industries including Telecommunication, Apparel, Education, FMCG, Media , Banks and Finance many others.',
    },
  },
  {
    id:'company-09',
    name:'Company09',
    logo:imageAssets.corporate.companies.company09.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-10',
    name:'Company10',
    logo:imageAssets.corporate.companies.company10.logo,
    href:'https://www.sumathiprinters.lk/',
    preview:{
      image:imageAssets.corporate.companies.company10.preview,
      metric:'Since 1984',
      title:'Printing & Publishing Excellence',
      description:'Premium printing, publishing, packaging and finishing solutions crafted with precision, consistency and professional care.',
    },
  },
  {
    id:'company-11',
    name:'Company11',
    logo:imageAssets.corporate.companies.company11.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-12',
    name:'Company12',
    logo:imageAssets.corporate.companies.company12.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-13',
    name:'Company13',
    logo:imageAssets.corporate.companies.company13.logo,
    href:null,
    preview:null,
  },
  {
    id:'company-14',
    name:'Company14',
    logo:imageAssets.corporate.companies.company14.logo,
    href:'https://sumathiawards.lk/',
    preview:{
      image:imageAssets.corporate.companies.company14.preview,
      metric:'Sumathi Awards',
      title:'පුංචි තිරයේ මහා කලා මංගල්‍ය',
      description:'Held since 1995, “Sumathi Awards” has become one of the most influential and prestigious television festival in Sri Lanka recognizing the creativity, talent, innovation and entertainment.',
    },
  },
  {
    id:'company-15',
    name:'Company15',
    logo:imageAssets.corporate.companies.company15.logo,
    href:'https://sumathiventures.com/',
    preview:{
      image:imageAssets.corporate.companies.company15.preview,
      metric:'Sumathi Ventures',
      title:'A foundation strengthenedby unity',
      description:'Using the most modern and up-to date technology to create a sustainable business that brings merits and profitability to the entire society.',
    },
  },
];
