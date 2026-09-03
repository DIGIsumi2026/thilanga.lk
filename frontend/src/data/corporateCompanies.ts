export type CorporateCompany = {
  id:string;
  name:string;
  logoText:string;
  href:string;
  hasPreview:boolean;
  previewTitle?:string;
  previewDescription?:string;
  previewMetric?:string;
  previewImage?:string;
};

export const corporateCompanies:CorporateCompany[] = [
  {
    id:'company-01',
    name:'Company One',
    logoText:'COMPANY ONE',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-02',
    name:'Company Two',
    logoText:'COMPANY TWO',
    href:'https://example.com',
    hasPreview:true,
    previewMetric:'35+',
    previewTitle:'Years of experience',
    previewDescription:'Building lasting value through enterprise and innovation.',
  },
  {
    id:'company-03',
    name:'Company Three',
    logoText:'COMPANY THREE',
    href:'https://example.com',
    hasPreview:true,
    previewMetric:'25+',
    previewTitle:'Business ventures',
    previewDescription:'Diversified leadership across multiple industries.',
  },
  {
    id:'company-04',
    name:'Company Four',
    logoText:'COMPANY FOUR',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-05',
    name:'Company Five',
    logoText:'COMPANY FIVE',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-06',
    name:'Company Six',
    logoText:'COMPANY SIX',
    href:'https://example.com',
    hasPreview:true,
    previewMetric:'1995',
    previewTitle:'A journey of impact',
    previewDescription:'Leadership shaped through vision and enterprise.',
  },
  {
    id:'company-07',
    name:'Company Seven',
    logoText:'COMPANY SEVEN',
    href:'https://example.com',
    hasPreview:true,
    previewMetric:'20+',
    previewTitle:'Strategic partnerships',
    previewDescription:'Connecting opportunity, expertise and long-term value.',
  },
  {
    id:'company-08',
    name:'Company Eight',
    logoText:'COMPANY EIGHT',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-09',
    name:'Company Nine',
    logoText:'COMPANY NINE',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-10',
    name:'Company Ten',
    logoText:'COMPANY TEN',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-11',
    name:'Company Eleven',
    logoText:'COMPANY ELEVEN',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-12',
    name:'Company Twelve',
    logoText:'COMPANY TWELVE',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-13',
    name:'Company Thirteen',
    logoText:'COMPANY THIRTEEN',
    href:'https://example.com',
    hasPreview:true,
    previewMetric:'30+',
    previewTitle:'Years of leadership',
    previewDescription:'A legacy of entrepreneurial thinking and progress.',
  },
  {
    id:'company-14',
    name:'Company Fourteen',
    logoText:'COMPANY FOURTEEN',
    href:'https://example.com',
    hasPreview:false,
  },
  {
    id:'company-15',
    name:'Company Fifteen',
    logoText:'COMPANY FIFTEEN',
    href:'https://example.com',
    hasPreview:false,
  },
];