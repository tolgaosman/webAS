// ===================================================================
// Zod Validation Schemas — Input Validation & Injection Protection
// Every field is strictly typed. No raw user input reaches the DB.
// ===================================================================

import { z } from "zod";

// --- Auth Schemas ---

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .max(254, "E-posta çok uzun"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalı")
    .max(128, "Şifre çok uzun"),
});

export const PasswordResetRequestSchema = z.object({
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .max(254, "E-posta çok uzun"),
});

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, "Token gerekli"),
  newPassword: z
    .string()
    .min(8, "Yeni şifre en az 8 karakter olmalı")
    .max(128, "Şifre çok uzun"),
});

// --- Portfolio Data Schemas ---

const PersonalSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  phone: z
    .string()
    .max(20)
    .regex(/^[+\d\s()-]*$/, "Geçersiz telefon numarası formatı"),
  instagram: z.string().url().max(500).or(z.literal("")),
  linkedin: z.string().url().max(500).or(z.literal("")),
  cvUrl: z.string().max(500),
  profileImage: z.string().max(500),
});

const CoreSkillSchema = z.object({
  title: z.string().min(1).max(100),
  desc: z.string().min(1).max(500),
});

const ProjectSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  thumbnail: z.string().max(500),
  images: z.string().max(2000),
  description: z.string().min(1).max(5000),
  metaRole: z.string().max(200).optional().default(""),
  metaClientLabel: z.string().max(200).optional().default(""),
  metaClient: z.string().max(200).optional().default(""),
  metaTools: z.string().max(500).optional().default(""),
  metaCategory: z.string().max(200).optional().default(""),
  goals: z.string().max(500).optional().default(""),
  achievements: z.array(z.string().max(500)).max(20).optional().default([]),
});

const EducationSchema = z.object({
  date: z.string().min(1).max(100),
  school: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  desc: z.string().min(1).max(1000),
});

const ExperienceSchema = z.object({
  id: z.string().min(1).max(50),
  date: z.string().min(1).max(100),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  accomplishments: z.array(z.string().max(500)).max(20),
});

const LanguageSchema = z.object({
  name: z.string().min(1).max(100),
  stars: z.number().int().min(1).max(5),
});

const CertificateSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(300),
  issuer: z.string().min(1).max(200),
  letter: z.string().min(1).max(2),
  image: z.string().max(500),
  validity: z.string().max(200),
  desc: z.string().min(1).max(1000),
});

export const PortfolioDataSchema = z.object({
  personal: PersonalSchema,
  coreSkills: z.array(CoreSkillSchema).max(20),
  projects: z.array(ProjectSchema).max(50),
  education: z.array(EducationSchema).max(20),
  experience: z.array(ExperienceSchema).max(20),
  languages: z.array(LanguageSchema).max(10),
  toolkit: z.array(z.string().max(100)).max(30),
  certificates: z.array(CertificateSchema).max(30),
});

// Type exports
export type LoginInput = z.infer<typeof LoginSchema>;
export type PortfolioData = z.infer<typeof PortfolioDataSchema>;
