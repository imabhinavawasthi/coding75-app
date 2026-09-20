import { PRO_LOGOS } from "./pro-logos";


export interface AssociatedLogo {
  name: string;
  logoUrl: string;
  logoDarkUrl?: string;
  themeClass?: string;
  heightClass?: string;
}

export interface MentorProfile {
  name: string;
  role: string;
  company: string;
  companyLogoUrl?: string;
  companyLogoDarkUrl?: string;
  companyLogoThemeClass?: string;
  formerCompany?: string;
  formerCompanyLogoUrl?: string;
  formerCompanyLogoDarkUrl?: string;
  formerCompanyLogoThemeClass?: string;
  experienceSummary: string;
  mentoredCount: string;
  credentials: string[];
  imagePath: string;
  linkedinUrl: string;
  youtubeUrl?: string;
  isLead?: boolean;
  highlightTag?: string;
  logos?: { url: string; alt: string; themeClass?: string }[];
  associatedLogos?: AssociatedLogo[];
  crackedLogos?: AssociatedLogo[];
  teachingLogos?: AssociatedLogo[];
}

export interface ComparisonItem {
  feature: string;
  description: string;
  coding75Pro: { value: string; positive: boolean; highlight?: boolean };
  bootcamps: { value: string; positive: boolean };
  genericPlatforms: { value: string; positive: boolean };
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  companyLogoDark?: string;
  companyLogoThemeClass?: string;
  quote: string;
  highlight: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "curriculum" | "classes" | "community" | "billing";
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING TIERS (Imported from centralized pro-pricing.ts)
// ─────────────────────────────────────────────────────────────────────────────
export {
  PRO_PRICING_CONFIG,
  PRO_PRICING_PLANS,
  getProPlanById,
  type ProPricingTier,
  type ProPricingTier as PricingPlan,
} from "./pro-pricing";

// ─────────────────────────────────────────────────────────────────────────────
// CORE PILLARS / WHAT YOU GET
// ─────────────────────────────────────────────────────────────────────────────
export const PRO_CORE_PILLARS = [
  {
    id: "dsa-curriculum",
    title: "Complete DSA Course & Video Lectures",
    instructor: "Recorded by Abhinav Awasthi",
    description: "18+ deeply structured modules covering from basic arrays to dynamic programming, graphs, and bitwise tricks. Detailed intuition, whiteboard breakdowns, and time-space analysis.",
    icon: "Video",
    highlight: "150+ Curated Video Lessons",
    badge: "By Abhinav Awasthi",
  },
  {
    id: "live-classes",
    title: "Weekly Live DSA Classes",
    instructor: "Interactive Problem Solving",
    description: "Every week, join live coding sessions where we tear down complex interview problems, discuss multiple approaches from brute-force to optimal, and take live questions.",
    icon: "Radio",
    highlight: "Interactive Weekend Classes",
    badge: "Every Single Week",
  },
  {
    id: "live-doubts",
    title: "Weekly Live Doubt Sessions",
    instructor: "Dedicated Mentor Support",
    description: "Never remain stuck on a corner case, edge case, or time-limit-exceeded bug. Bring your questions directly to live doubt clearing sessions.",
    icon: "HelpCircle",
    highlight: "Zero Pending Doubts",
    badge: "Live 1:1 Resolving",
  },
  {
    id: "cs-system-design",
    title: "CS Fundamentals & System Design Notes",
    instructor: "High-Yield Interview Summaries",
    description: "Crisp, battle-tested revision sheets for Operating Systems, Computer Networks, DBMS (SQL & NoSQL), Object-Oriented Design (LLD), and High-Level System Architecture.",
    icon: "BookOpen",
    highlight: "Instant Interview Revision",
    badge: "Full Access Included",
  },
  {
    id: "cp-access",
    title: "Free Access to all CP Content",
    instructor: "Competitive Programming Edge",
    description: "Master rating climbs on Codeforces and CodeChef. Access curated contest problem ladders, past contest upsolving guides, and speed-coding tricks.",
    icon: "Trophy",
    highlight: "Rating Boosters & Ladders",
    badge: "100% Free for Pro",
  },
  {
    id: "community-opportunities",
    title: "Pro Community & Curated Job Drops",
    instructor: "Private Engineering Network",
    description: "Join our private community of ambitious engineers. Get daily curated off-campus job opportunities, verified internship test links, and peer accountability circles.",
    icon: "Users",
    highlight: "Curated Opportunity Alerts",
    badge: "Daily Placement Drops",
  },
  {
    id: "masterclasses",
    title: "Masterclasses by Top Tech Mentors",
    instructor: "Industry Expert Deep-Dives",
    description: "Special weekend masterclasses covering modern tech stacks, AI tools, resume optimization, salary negotiation, and behavioral interview mastery.",
    icon: "Sparkles",
    highlight: "FAANG+ Senior Engineers",
    badge: "All Included in Pro",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MENTORS
// ─────────────────────────────────────────────────────────────────────────────
export const PRO_MENTORS: MentorProfile[] = [
  {
    name: "Abhinav Awasthi",
    role: "SDE 2 @ Zeta • Former SDE @ LinkedIn",
    company: "Zeta",
    companyLogoUrl: PRO_LOGOS.zeta.logoUrl,
    companyLogoThemeClass: PRO_LOGOS.zeta.themeClass,
    formerCompany: "LinkedIn",
    formerCompanyLogoUrl: PRO_LOGOS.linkedin.logoUrl,
    formerCompanyLogoThemeClass: PRO_LOGOS.linkedin.themeClass,
    experienceSummary:
      "Abhinav personally architected and recorded the complete DSA master lectures. SDE 2 at Zeta, Former SDE at LinkedIn. Cracked interviews of Amazon, Zomato, Zscaler, Gameskraft and top tech companies.",
    mentoredCount: "5,000+ Students Mentored",
    credentials: [
      "Top 1% rated in world on LeetCode",
      "Top 1% rated in India on CodeChef",
      "CM Codeforces",
      "ICPC Regionalist (AIR-57)",
      "Winner LinkedIn Hackday",
      "Mentored 5,000+ students personally",
    ],
    imagePath: "/pictures/abhinav.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/abhinavawasthi01/",
    youtubeUrl: "https://www.youtube.com/@abhinavawasthi",
    isLead: true,
    highlightTag: "Lead Mentor & Course Creator",
    crackedLogos: [
      { name: "Amazon", logoUrl: PRO_LOGOS.amazon.logoUrl, themeClass: PRO_LOGOS.amazon.themeClass, heightClass: "h-5 sm:h-6" },
      { name: "Zomato", logoUrl: PRO_LOGOS.zomato.logoUrl, heightClass: "h-4 sm:h-5" },
      { name: "Zscaler", logoUrl: PRO_LOGOS.zscaler.logoUrl, themeClass: PRO_LOGOS.zscaler.themeClass, heightClass: "h-5 sm:h-6" },
      { name: "Zeta", logoUrl: PRO_LOGOS.zeta.logoUrl, themeClass: PRO_LOGOS.zeta.themeClass, heightClass: "h-5 sm:h-6" },
      { name: "LinkedIn", logoUrl: PRO_LOGOS.linkedin.logoUrl, themeClass: PRO_LOGOS.linkedin.themeClass, heightClass: "h-5 sm:h-6" },
    ],
    teachingLogos: [
      { name: "GeeksforGeeks", logoUrl: PRO_LOGOS.geeksforgeeks.logoUrl, heightClass: "h-5 sm:h-6" },
      { name: "Newton School", logoUrl: PRO_LOGOS.newtonSchool.logoUrl, heightClass: "h-5 sm:h-6" },
      { name: "PW Skills", logoUrl: PRO_LOGOS.pwskills.logoUrl, themeClass: PRO_LOGOS.pwskills.themeClass, heightClass: "h-5 sm:h-6" },
      { name: "CodeChef", logoUrl: PRO_LOGOS.codechef.logoUrl, heightClass: "h-5 sm:h-6" }
    ],
  },
  {
    name: "Harshit Varshney",
    role: "Software Engineer",
    company: "Microsoft",
    companyLogoUrl: PRO_LOGOS.microsoft.logoUrl,
    companyLogoDarkUrl: PRO_LOGOS.microsoft.logoDarkUrl,
    formerCompany: "Amazon, Airtel",
    formerCompanyLogoUrl: PRO_LOGOS.amazon.logoUrl,
    formerCompanyLogoThemeClass: PRO_LOGOS.amazon.themeClass,
    experienceSummary:
      "Software Engineer at Microsoft, Former SDE at Amazon, Former SDE and Intern at Airtel. Competitive programming veteran.",
    mentoredCount: "2,000+ Students Mentored",
    credentials: [
      "Software Engineer @ Microsoft",
      "Former SDE @ Amazon",
      "Former SDE & Intern @ Airtel",
      "Competitive Programming Veteran",
    ],
    imagePath: "/pictures/harshit.png",
    linkedinUrl: "https://www.linkedin.com/in/harshit-theguy/",
    isLead: false,
    associatedLogos: [
      { name: "Microsoft", logoUrl: PRO_LOGOS.microsoft.logoUrl, logoDarkUrl: PRO_LOGOS.microsoft.logoDarkUrl, heightClass: "h-5" },
      { name: "Amazon", logoUrl: PRO_LOGOS.amazon.logoUrl, themeClass: PRO_LOGOS.amazon.themeClass, heightClass: "h-5" },
      { name: "Airtel", logoUrl: PRO_LOGOS.airtel.logoUrl, heightClass: "h-4" },
    ],
  },
  {
    name: "Abhay Ray",
    role: "Software Engineer",
    company: "Zomato",
    companyLogoUrl: PRO_LOGOS.zomato.logoUrl,
    formerCompany: "Urban Company",
    formerCompanyLogoUrl: PRO_LOGOS.urbanCompany.logoUrl,
    formerCompanyLogoThemeClass: PRO_LOGOS.urbanCompany.themeClass,
    experienceSummary:
      "Software Engineer at Zomato. Ex-Urban Company, UKG, and mentor at leading ed-tech platforms.",
    mentoredCount: "500+ Students Mentored",
    credentials: [
      "Software Engineer @ Zomato",
      "Former SWE Intern @ Urban Company",
      "UKG Experience",
      "500+ Students Mentored",
    ],
    imagePath: "/pictures/abhay.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/abhay-ray-204b44187/",
    isLead: false,
    associatedLogos: [
      { name: "Zomato", logoUrl: PRO_LOGOS.zomato.logoUrl, heightClass: "h-4" },
      { name: "Urban Company", logoUrl: PRO_LOGOS.urbanCompany.logoUrl, themeClass: PRO_LOGOS.urbanCompany.themeClass, heightClass: "h-5" },
    ],
  },
  {
    name: "Suraj Gaud",
    role: "Software Engineer",
    company: "Induced AI",
    companyLogoUrl: PRO_LOGOS.inducedAi.logoUrl,
    companyLogoThemeClass: PRO_LOGOS.inducedAi.themeClass,
    formerCompany: "Nucast",
    formerCompanyLogoUrl: PRO_LOGOS.nucast.logoUrl,
    formerCompanyLogoThemeClass: PRO_LOGOS.nucast.themeClass,
    experienceSummary:
      "Software Engineer at Induced AI. Hackathon champion, Open Source contributor, and AI/Web3 architect.",
    mentoredCount: "1,000+ Students Mentored",
    credentials: [
      "Software Engineer @ Induced AI",
      "Former SWE @ Nucast",
      "Hackathon Champion & Open Source Contributor",
      "AI / Web3 Systems Architect",
    ],
    imagePath: "/pictures/suraj.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/gaudsuraj/",
    isLead: false,
    associatedLogos: [
      { name: "Induced AI", logoUrl: PRO_LOGOS.inducedAi.logoUrl, themeClass: PRO_LOGOS.inducedAi.themeClass, heightClass: "h-5" },
      { name: "Nucast", logoUrl: PRO_LOGOS.nucast.logoUrl, themeClass: PRO_LOGOS.nucast.themeClass, heightClass: "h-4" },
    ],
  },
  {
    name: "Jwala Chorasiya",
    role: "Software Developer",
    company: "Amazon",
    companyLogoUrl: PRO_LOGOS.amazon.logoUrl,
    companyLogoThemeClass: PRO_LOGOS.amazon.themeClass,
    formerCompany: "J.P. Morgan (UK) • Instructor @ CodeChef",
    formerCompanyLogoUrl: PRO_LOGOS.jpmorgan.logoUrl,
    formerCompanyLogoThemeClass: PRO_LOGOS.jpmorgan.themeClass,
    experienceSummary:
      "Software Developer at Amazon, Former SWE at J.P. Morgan (UK). Instructor @ CodeChef. ICPC '22 Regionalist with 3,000+ engineers mentored.",
    mentoredCount: "3,000+ Students Mentored",
    credentials: [
      "Software Developer @ Amazon",
      "Former SWE @ J.P. Morgan (UK)",
      "Instructor @ CodeChef",
      "ICPC '22 Regionalist",
    ],
    imagePath: "/pictures/jwala.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/jwalapc/",
    isLead: false,
    associatedLogos: [
      { name: "Amazon", logoUrl: PRO_LOGOS.amazon.logoUrl, themeClass: PRO_LOGOS.amazon.themeClass, heightClass: "h-5" },
      { name: "J.P. Morgan", logoUrl: PRO_LOGOS.jpmorgan.logoUrl, themeClass: PRO_LOGOS.jpmorgan.themeClass, heightClass: "h-4" },
      { name: "CodeChef", logoUrl: PRO_LOGOS.codechef.logoUrl, heightClass: "h-5" },
    ],
  },
  {
    name: "Yash Pandey",
    role: "Software Engineer",
    company: "Agoda",
    companyLogoUrl: PRO_LOGOS.agoda.logoUrl,
    formerCompany: "Neoterics Labs",
    experienceSummary:
      "Software Engineer at Agoda, Ex-Neoterics Labs. Specialist in Full-stack Systems, MERN architecture, and modern web applications.",
    mentoredCount: "500+ Students Mentored",
    credentials: [
      "Software Engineer @ Agoda",
      "Ex-Neoterics Labs",
      "Specialist in Full-stack Systems & MERN Architecture",
      "500+ Students Mentored",
    ],
    imagePath: "/pictures/yash-pandey.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/yash-pandey-53aa3a21b/",
    isLead: false,
    associatedLogos: [
      { name: "Agoda", logoUrl: PRO_LOGOS.agoda.logoUrl, heightClass: "h-5" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON MATRIX
// Note: "Lead Instructor Pedigree" removed per explicit user feedback.
// No references to "referrals" per explicit user feedback.
// ─────────────────────────────────────────────────────────────────────────────
export const PRO_COMPARISON_MATRIX: ComparisonItem[] = [
  {
    feature: "Weekly Live DSA Classes",
    description: "Real-time interactive classes on high-frequency patterns and complex algorithms",
    coding75Pro: { value: "Yes, Every Week (Live + Recordings)", positive: true, highlight: true },
    bootcamps: { value: "Limited to fixed 3-month schedule", positive: false },
    genericPlatforms: { value: "No, Pre-recorded static videos only", positive: false },
  },
  {
    feature: "Live Doubt Resolution Sessions",
    description: "Dedicated sessions where instructors answer your personal doubts directly",
    coding75Pro: { value: "Yes, Weekly Live Interactive Doubts", positive: true, highlight: true },
    bootcamps: { value: "Teaching Assistants via slow ticket queues", positive: false },
    genericPlatforms: { value: "No live doubts; stale discussion forum", positive: false },
  },
  {
    feature: "CS Fundamentals Notes Included",
    description: "Interview-ready summaries of OS, DBMS, Computer Networks, and OOPS",
    coding75Pro: { value: "Included 100% Free with Pro", positive: true, highlight: true },
    bootcamps: { value: "Charged as separate upsell (+₹10k to ₹15k)", positive: false },
    genericPlatforms: { value: "Not included; sell separate courses", positive: false },
  },
  {
    feature: "System Design Notes (LLD & HLD)",
    description: "Architecture patterns, schema design, microservices, and design interview blueprints",
    coding75Pro: { value: "Included 100% Free with Pro", positive: true, highlight: true },
    bootcamps: { value: "Charged as separate ₹25k+ course", positive: false },
    genericPlatforms: { value: "Generic surface-level articles", positive: false },
  },
  {
    feature: "Competitive Programming (CP) Access",
    description: "Contest ladders, Codeforces/CodeChef upsolving, and rating growth guides",
    coding75Pro: { value: "Full CP Catalog Free for Pro", positive: true, highlight: true },
    bootcamps: { value: "Never included; strictly DSA basics", positive: false },
    genericPlatforms: { value: "No CP curriculum or contest support", positive: false },
  },
  {
    feature: "Curated Opportunities & Off-Campus Hiring Drops",
    description: "Daily verified tech job openings, internship test alerts, and hiring links",
    coding75Pro: { value: "Daily Curated Drops in Active Community", positive: true, highlight: true },
    bootcamps: { value: "Inflated placement promises with fine print", positive: false },
    genericPlatforms: { value: "Zero opportunity updates or alerts", positive: false },
  },
  {
    feature: "Price & Commitment",
    description: "Total financial investment required to prepare for tech placements",
    coding75Pro: { value: "From ₹799/mo or ₹5,999 for 2 Years (<₹26/day)", positive: true, highlight: true },
    bootcamps: { value: "₹50,000 to ₹1,50,000 + ISA cuts", positive: false },
    genericPlatforms: { value: "₹3,000 to ₹15,000 per isolated video course", positive: false },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
export const PRO_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Aditya Chaudhary",
    role: "Software Engineer Intern",
    company: "ServiceNow",
    companyLogo: PRO_LOGOS.servicenow.logoUrl,
    companyLogoThemeClass: PRO_LOGOS.servicenow.themeClass,
    quote: "I have attended the live DSA sessions and they are very useful. The concepts are explained thoroughly and doubts are resolved well, which helped me to get prepared for my placements and interviews.",
    highlight: "Placed at ServiceNow",
  },
  {
    name: "Jatin Pal",
    role: "SWE Intern",
    company: "Microsoft",
    companyLogo: PRO_LOGOS.microsoft.logoUrl,
    companyLogoDark: PRO_LOGOS.microsoft.logoDarkUrl,
    quote: "Live project building sessions helped me a lot to put some good projects in my resume, with good resume review and mock interviews sessions, I got selected in microsoft internship.",
    highlight: "SWE Intern at Microsoft",
  },
  {
    name: "Ripan Roy",
    role: "SDE Intern (Ex-ICPC Regionalist)",
    company: "GeeksforGeeks",
    companyLogo: PRO_LOGOS.geeksforgeeks.logoUrl,
    quote: "I have attended the live DSA&CP sessions and they are very useful. All the concepts are explained thoroughly and doubts are resolved well. I was able to reach ACM ICPC Regionals and grab an SDE internship at GeeksForGeeks.",
    highlight: "ICPC Regionalist & GFG SDE",
  },
  {
    name: "Priyanshu Singh",
    role: "Software Engineer Intern",
    company: "OpenText",
    companyLogo: PRO_LOGOS.opentext.logoUrl,
    companyLogoThemeClass: PRO_LOGOS.opentext.themeClass,
    quote: "Attending the DSA and C++ lectures has truly been a game-changer for me. The guidance and regular doubt-clearing sessions were invaluable, helping me breeze through coding challenges and interview rounds with confidence.",
    highlight: "SWE Intern at OpenText",
  },
  {
    name: "Aman Verma",
    role: "Software Engineer Intern",
    company: "Juspay",
    companyLogo: PRO_LOGOS.juspay.logoUrl,
    quote: "I  was struggling with DSA, but after joining regular DSA and CP classes, I started solving problems and worked on my problem solving skills, and I was able to clear coding round of Juspay.",
    highlight: "Cleared Juspay Coding Round",
  },
  {
    name: "Aditya Pandey",
    role: "Software Engineer Intern",
    company: "Paisabazaar",
    companyLogo: PRO_LOGOS.paisabazaar.logoUrl,
    quote: "I used to attend live classes of DSA and CS Fundamentals, which made my basics of DSA and CS very clear, and I got my first internship in my second year.",
    highlight: "2nd Year Internship Win",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FREQUENTLY ASKED QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const PRO_FAQS: FaqItem[] = [
  {
    question: "What exactly is included with coding75 Pro?",
    answer: "coding75 Pro is our all-in-one placement pass. It gives you unrestricted access to the complete DSA master course & video lectures, weekly live DSA problem-solving classes, weekly live doubt resolution sessions, interview-ready CS Fundamentals and System Design notes, all Competitive Programming roadmaps, masterclasses, and our private Pro community with curated tech job opportunities.",
    category: "curriculum",
  },
  {
    question: "How frequently are live classes and doubt sessions held?",
    answer: "Live interactive classes and doubt sessions are held every week on weekends and select weekday evenings (typically 8:00 PM IST). This schedule allows both working professionals and college students to participate live without clashing with work or university hours.",
    category: "classes",
  },
  {
    question: "Are class recordings and resources provided if I miss a live session?",
    answer: "Yes! Every single live session is recorded in HD and published directly to your Pro student dashboard within hours, along with code snippets, problem links, and lecture whiteboard notes.",
    category: "classes",
  },
  {
    question: "What is the cost, and why is it described as 'less than ₹10/day'?",
    answer: "A monthly pass is just ₹799/month (~₹26/day). Our 2-Year Pro Pass is ₹5,999 for 2 full years (~₹8/day) — less than ₹10 a day and cheaper than a cup of tea! Rather than charging exorbitant bootcamp fees of ₹50,000–₹1,00,000+, we keep our pricing accessible for all ambitious students.",
    category: "billing",
  },
  {
    question: "What topics are covered in the CS Fundamentals & System Design notes?",
    answer: "The notes cover essential placement topics: Operating Systems (processes, threads, deadlocks, memory management), Computer Networks (TCP/IP, OSI, HTTP/HTTPS, DNS), DBMS (SQL queries, indexing, normalization, ACID properties, NoSQL), Object-Oriented Design (Design patterns, SOLID principles), and High-Level System Design (caching, load balancers, rate limiting, sharding).",
    category: "curriculum",
  },
  {
    question: "How do the community and opportunity drops work?",
    answer: "Upon joining Pro, you are added to our private members-only community. We regularly drop curated hiring links across top tech firms, off-campus drives, and verified internship application tests.",
    category: "community",
  },
  {
    question: "How can I get support if I have questions before joining?",
    answer: "You can reach out directly to our team via WhatsApp or Telegram! Simply click the 'Chat on WhatsApp' button on this page for quick guidance.",
    category: "billing",
  },
];
