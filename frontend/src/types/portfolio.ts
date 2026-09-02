// ===================================================================
// Portfolio data model — mirrors legacy/backend/src/schemas/portfolio.schema.ts
// (Zod) field-for-field. This is the contract both the frontend and the
// future Laravel API serializer must produce/consume byte-identically.
//
// NOTE: `projects[].images` is a single comma-separated STRING, not an
// array — this matches the legacy API shape and must not change without
// also changing the backend serializer (see migration plan §Faz 4).
// ===================================================================

export interface Personal {
  name: string;
  email: string;
  phone: string;
  instagram: string; // URL or ""
  linkedin: string; // URL or ""
  cvUrl: string;
  profileImage: string;
}

export interface CoreSkill {
  title: string;
  desc: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  images: string; // comma-separated paths, NOT an array
  description: string;
  metaRole: string;
  metaClientLabel: string;
  metaClient: string;
  metaTools: string;
  metaCategory: string;
  goals: string;
  achievements: string[];
}

export interface Education {
  date: string;
  school: string;
  degree: string;
  desc: string;
}

export interface Experience {
  id: string;
  date: string;
  role: string;
  company: string;
  accomplishments: string[];
}

export interface Language {
  name: string;
  stars: number; // 1-5
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  letter: string; // 1-2 char avatar initial
  image: string;
  validity: string;
  desc: string;
}

export interface PortfolioData {
  personal: Personal;
  coreSkills: CoreSkill[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  toolkit: string[];
  certificates: Certificate[];
}
