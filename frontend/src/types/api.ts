import type {
  Certificate,
  CoreSkill,
  Education,
  Experience,
  Language,
  Personal,
  Project,
  Toolkit,
} from "./portfolio";
import type { BioParagraph, ContentBlockMap, Hobby, Specialty } from "./content";

/** The full GET /api/portfolio response shape (see PortfolioSerializer::toArray()). */
export interface PortfolioApiResponse {
  personal: Personal;
  coreSkills: CoreSkill[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  toolkit: Toolkit[];
  certificates: Certificate[];
  bioParagraphs: BioParagraph[];
  hobbies: Hobby[];
  specialties: Specialty[];
  content: ContentBlockMap;
}
