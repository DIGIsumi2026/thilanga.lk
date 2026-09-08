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
    name:'Company One',
    logoText:'COMPANY ONE',
    href:null,
    preview:null,
  },
  {
    id:'company-02',
    name:'Company Two',
    logoText:'COMPANY TWO',
    href:'https://example.com',
    preview:{
      metric:'35+',
      title:'Years of experience',
      description:'Building lasting value through enterprise and innovation.',
    },
  },
  {
    id:'company-03',
    name:'Company Three',
    logoText:'COMPANY THREE',
    href:null,
    preview:{
      metric:'25+',
      title:'Business ventures',
      description:'Diversified leadership across multiple industries.',
    },
  },
  {
    id:'company-04',
    name:'Company Four',
    logoText:'COMPANY FOUR',
    href:'https://example.com',
    preview:null,
  },
  {
    id:'company-05',
    name:'Company Five',
    logoText:'COMPANY FIVE',
    href:null,
    preview:null,
  },
  {
    id:'company-06',
    name:'Company Six',
    logoText:'COMPANY SIX',
    href:'https://example.com',
    preview:{
      metric:'1995',
      title:'A journey of impact',
      description:'Leadership shaped through vision and enterprise.',
    },
  },
  {
    id:'company-07',
    name:'Company Seven',
    logoText:'COMPANY SEVEN',
    href:null,
    preview:{
      metric:'20+',
      title:'Strategic partnerships',
      description:'Connecting opportunity, expertise and long-term value.',
    },
  },
  {
    id:'company-08',
    name:'Company Eight',
    logoText:'COMPANY EIGHT',
    href:'https://example.com',
    preview:null,
  },
  {
    id:'company-09',
    name:'Company Nine',
    logoText:'COMPANY NINE',
    href:null,
    preview:null,
  },
  {
    id:'company-10',
    name:'Company Ten',
    logoText:'COMPANY TEN',
    href:'https://example.com',
    preview:null,
  },
  {
    id:'company-11',
    name:'Company Eleven',
    logoText:'COMPANY ELEVEN',
    href:null,
    preview:null,
  },
  {
    id:'company-12',
    name:'Company Twelve',
    logoText:'COMPANY TWELVE',
    href:'https://example.com',
    preview:null,
  },
  {
    id:'company-13',
    name:'Company Thirteen',
    logoText:'COMPANY THIRTEEN',
    href:'https://example.com',
    preview:{
      metric:'30+',
      title:'Years of leadership',
      description:'A legacy of entrepreneurial thinking and progress.',
    },
  },
  {
    id:'company-14',
    name:'Company Fourteen',
    logoText:'COMPANY FOURTEEN',
    href:null,
    preview:null,
  },
  {
    id:'company-15',
    name:'Company Fifteen',
    logoText:'COMPANY FIFTEEN',
    href:'https://example.com',
    preview:null,
  },
];
