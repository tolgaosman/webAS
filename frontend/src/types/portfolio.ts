import type { LocalizedString } from "../i18n/types";

// Mirrors backend/app/Services/PortfolioSerializer.php field-for-field.
// `id` is the real database primary key (see that serializer's
// docblock for why this differs from the legacy string-slug contract).

export interface Personal {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  linkedin: string;
  cvUrl: LocalizedString;
  profileImage: string;
}

export interface CoreSkill {
  id: number;
  title: LocalizedString;
  desc: LocalizedString;
}

export interface Project {
  id: number;
  title: LocalizedString;
  category: LocalizedString;
  thumbnail: string;
  images: string[];
  description: LocalizedString;
  metaRole: LocalizedString;
  metaClientLabel: LocalizedString;
  metaClient: LocalizedString;
  metaTools: LocalizedString;
  metaCategory: LocalizedString;
  goals: LocalizedString;
  achievements: LocalizedString[];
}

export interface Education {
  id: number;
  date: LocalizedString;
  school: string;
  degree: LocalizedString;
  desc: LocalizedString;
}

export interface Experience {
  id: number;
  date: LocalizedString;
  role: LocalizedString;
  company: string;
  accomplishments: LocalizedString[];
}

export interface Language {
  id: number;
  name: LocalizedString;
  stars: number;
}

export interface Toolkit {
  id: number;
  badge: LocalizedString;
}

export interface Certificate {
  id: number;
  title: LocalizedString;
  issuer: string;
  letter: string;
  image: string;
  validity: LocalizedString;
  desc: LocalizedString;
}
