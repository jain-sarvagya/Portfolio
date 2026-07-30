'use server';

import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'super-secret-portfolio-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_DIR = path.join(process.cwd(), 'data');

// Encryption Helpers for secure session tokens without external JWT packages
function signToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + 24 * 60 * 60 * 1000 }); // 24 Hours
  const iv = crypto.randomBytes(16);
  // Ensure the encryption key is exactly 32 bytes
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(payload, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function verifyToken(token: string): boolean {
  try {
    const parts = token.split(':');
    if (parts.length !== 2) return false;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const { exp } = JSON.parse(decrypted);
    return exp > Date.now();
  } catch (e) {
    return false;
  }
}

// Authentication Actions
export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  if (password === ADMIN_PASSWORD) {
    const token = signToken();
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/'
    });
    return { success: true };
  }
  return { success: false, error: 'Incorrect password' };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return verifyToken(token);
}

// File Access Helpers
async function readDataFile(fileName: string): Promise<any> {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read data file ${fileName}:`, error);
    return null;
  }
}

async function writeDataFile(fileName: string, data: any): Promise<boolean> {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Failed to write data file ${fileName}:`, error);
    return false;
  }
}

// Config CRUD actions (used by portfolio display & admin config tab)
export async function getPortfolioData(): Promise<{
  personalInfo: any;
  socials: any;
  skills: any;
  experience: any;
  achievements: any;
  projects: any;
  education: any;
  marquee: any;
  stats: any;
}> {
  return {
    personalInfo: await readDataFile('personal-info.json') || {},
    socials: await readDataFile('socials.json') || {},
    skills: await readDataFile('skills.json') || [],
    experience: await readDataFile('experience.json') || [],
    achievements: await readDataFile('achievements.json') || [],
    projects: await readDataFile('projects.json') || [],
    education: await readDataFile('education.json') || [],
    marquee: await readDataFile('marquee.json') || [],
    stats: await readDataFile('stats.json') || [],
  };
}

export async function saveConfig(
  fileName: string,
  data: any
): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate fileName is one of our allowed config files to prevent arbitrary file writes
  const allowedFiles = [
    'personal-info.json',
    'socials.json',
    'skills.json',
    'experience.json',
    'achievements.json',
    'education.json',
    'marquee.json',
    'stats.json',
  ];
  if (!allowedFiles.includes(fileName)) {
    return { success: false, error: 'Invalid configuration file' };
  }

  const success = await writeDataFile(fileName, data);
  if (success) {
    return { success: true };
  }
  return { success: false, error: 'Failed to write configuration file' };
}

// Project specific Actions
export async function getProjects(): Promise<any[]> {
  return await readDataFile('projects.json') || [];
}

export async function saveProjects(projects: any[]): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Unauthorized' };
  }

  const success = await writeDataFile('projects.json', projects);
  if (success) {
    return { success: true };
  }
  return { success: false, error: 'Failed to save projects' };
}

// Image upload Server Action
export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save image to /public/projects/
    const projectsDir = path.join(process.cwd(), 'public', 'projects');
    await fs.mkdir(projectsDir, { recursive: true });

    // Sanitize file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFileName = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(projectsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    return { success: true, url: `/projects/${uniqueFileName}` };
  } catch (error: any) {
    console.error('Failed to upload image:', error);
    return { success: false, error: error.message || 'Image upload failed' };
  }
}

// Profile Image upload Server Action
export async function uploadProfileImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save image to /public/
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    // Sanitize file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFileName = `profile_${Date.now()}_${sanitizedName}`;
    const filePath = path.join(publicDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      url: `/${uniqueFileName}`
    };
  } catch (error: any) {
    console.error('Failed to upload profile image:', error);
    return { success: false, error: error.message || 'Profile image upload failed' };
  }
}
