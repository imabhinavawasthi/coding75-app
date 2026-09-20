/**
 * Centralized Logo Configuration for coding75 Pro
 * All logos use clean transparent backgrounds and theme-aligned CSS classes.
 */

export interface CompanyLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  logoDarkUrl?: string;
  alt: string;
  /** Extra CSS classes for theme alignment (e.g. invert in dark mode for black text logos) */
  themeClass?: string;
  /** Recommended display height class */
  heightClass?: string;
}

export const PRO_LOGOS = {
  google: {
    id: "google",
    name: "Google",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    alt: "Google logo",
    heightClass: "h-5 sm:h-6",
  },
  microsoft: {
    id: "microsoft",
    name: "Microsoft",
    logoUrl: "/logos/microsoft.svg",
    logoDarkUrl: "/logos/microsoft-dark.svg",
    alt: "Microsoft logo",
    heightClass: "h-5 sm:h-6",
  },
  amazon: {
    id: "amazon",
    name: "Amazon",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    alt: "Amazon logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg",
    alt: "LinkedIn logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  zeta: {
    id: "zeta",
    name: "Zeta",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Zeta_Services_logo.png",
    alt: "Zeta logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  servicenow: {
    id: "servicenow",
    name: "ServiceNow",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg",
    alt: "ServiceNow logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  zomato: {
    id: "zomato",
    name: "Zomato",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    alt: "Zomato logo",
    heightClass: "h-4 sm:h-5",
  },
  airtel: {
    id: "airtel",
    name: "Airtel",
    logoUrl: "https://1000logos.net/wp-content/uploads/2023/06/Airtel-logo.png",
    alt: "Airtel logo",
    heightClass: "h-5 sm:h-6",
  },
  urbanCompany: {
    id: "urbanCompany",
    name: "Urban Company",
    logoUrl: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/images/supply/partner-training/1628575858610-5b0ae4.png",
    alt: "Urban Company logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  inducedAi: {
    id: "inducedAi",
    name: "Induced AI",
    logoUrl: "/logos/inducedai.png",
    alt: "Induced AI logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  coding75: {
    id: "coding75",
    name: "coding75",
    logoUrl: "/logos/coding75.png",
    alt: "coding75 logo",
    heightClass: "h-5 sm:h-6",
  },
  geeksforgeeks: {
    id: "geeksforgeeks",
    name: "GeeksforGeeks",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg",
    alt: "GeeksforGeeks logo",
    heightClass: "h-5 sm:h-6",
  },
  opentext: {
    id: "opentext",
    name: "OpenText",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/OpenText_logo.svg",
    alt: "OpenText logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  juspay: {
    id: "juspay",
    name: "Juspay",
    logoUrl: "https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png",
    alt: "Juspay logo",
    heightClass: "h-5 sm:h-6",
  },
  paisabazaar: {
    id: "paisabazaar",
    name: "Paisabazaar",
    logoUrl: "https://www.paisabazaar.com/PBHP/assets/images/paisabazaar-logo.svg",
    alt: "Paisabazaar logo",
    heightClass: "h-5 sm:h-6",
  },
  newtonSchool: {
    id: "newtonSchool",
    name: "Newton School",
    logoUrl: "https://assets-global.website-files.com/62e8d2ea218fb7676b6892a6/64df4847c57fbbefc3975c51_NS%20Primary%20wo_o%20button.png",
    alt: "Newton School logo",
    heightClass: "h-5 sm:h-6",
  },
  propreturns: {
    id: "propreturns",
    name: "PropReturns",
    logoUrl: "https://image4.owler.com/logo/propreturns-_owler_20210826_171408_original.png",
    alt: "PropReturns logo",
    heightClass: "h-5 sm:h-6",
  },
  jpmorgan: {
    id: "jpmorgan",
    name: "J.P. Morgan",
    logoUrl: "https://www.jpmorganchase.com/content/dam/shared/logos/jpmc-logo-290x20px.png",
    alt: "J.P. Morgan logo",
    heightClass: "h-4 sm:h-5",
    themeClass: "dark:brightness-0 dark:invert",
  },
  agoda: {
    id: "agoda",
    name: "Agoda",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png",
    alt: "Agoda logo",
    heightClass: "h-5 sm:h-6",
  },
  crackdsa: {
    id: "crackdsa",
    name: "crackDSA",
    logoUrl: "/logos/crackdsa.png",
    alt: "crackDSA logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  codechef: {
    id: "codechef",
    name: "CodeChef",
    logoUrl: "/logos/codechef.png",
    alt: "CodeChef logo",
    heightClass: "h-5 sm:h-6",
  },
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    logoUrl: "/logos/codeforces.svg",
    alt: "Codeforces logo",
    heightClass: "h-5 sm:h-6",
  },
  leetcode: {
    id: "leetcode",
    name: "LeetCode",
    logoUrl: "/logos/leetcode.png",
    alt: "LeetCode logo",
    heightClass: "h-5 sm:h-6",
  },
  zscaler: {
    id: "zscaler",
    name: "Zscaler",
    logoUrl: "/logos/zscaler.svg",
    alt: "Zscaler logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  gameskraft: {
    id: "gameskraft",
    name: "Gameskraft",
    logoUrl: "/logos/gameskraft.png",
    alt: "Gameskraft logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "rounded-md",
  },
  pwskills: {
    id: "pwskills",
    name: "PW Skills",
    logoUrl: "/logos/pwskills.svg",
    alt: "PW Skills logo",
    heightClass: "h-5 sm:h-6",
    themeClass: "dark:brightness-0 dark:invert",
  },
  nucast: {
    id: "nucast",
    name: "Nucast",
    logoUrl: "/logos/nucast.svg",
    alt: "Nucast logo",
    heightClass: "h-4 sm:h-5",
    themeClass: "dark:brightness-0 dark:invert",
  },
} as const satisfies Record<string, CompanyLogoItem>;

/** Hero Social Proof Bar Company Logos */
export const HERO_SOCIAL_LOGOS: CompanyLogoItem[] = [
  PRO_LOGOS.google,
  PRO_LOGOS.linkedin,
  PRO_LOGOS.amazon,
  PRO_LOGOS.microsoft,
  PRO_LOGOS.zeta,
  PRO_LOGOS.servicenow,
  PRO_LOGOS.zomato,
];

/** Testimonial / Reviews Company Logos mapped by Company Name */
export const TESTIMONIAL_LOGOS: Record<string, CompanyLogoItem> = {
  ServiceNow: PRO_LOGOS.servicenow,
  Microsoft: PRO_LOGOS.microsoft,
  GeeksforGeeks: PRO_LOGOS.geeksforgeeks,
  OpenText: PRO_LOGOS.opentext,
  Juspay: PRO_LOGOS.juspay,
  Paisabazaar: PRO_LOGOS.paisabazaar,
};
