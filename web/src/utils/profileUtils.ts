import type { Profile } from '../../../shared/src/types';

const PROFILES_KEY = 'kdt_profiles';
const ACTIVE_KEY = 'kdt_active';

export function getProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw) as Profile[];
  } catch { /* ignore */ }
  return [];
}

export function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function addProfile(profile: Profile): void {
  const profiles = getProfiles();
  saveProfiles([...profiles, profile]);
}

export function deleteProfile(id: string): void {
  saveProfiles(getProfiles().filter((p) => p.id !== id));
  if (getActiveProfileId() === id) setActiveProfileId(null);
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProfileId(id: string | null): void {
  if (id === null) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, id);
}

export function generateProfileId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const AVATAR_OPTIONS = [
  '🦁', '🐯', '🐻', '🦊', '🐼', '🐨', '🐸', '🦋',
  '🦄', '🐲', '🦅', '🐬', '🦖', '🐙', '🦒', '🐧',
  '👦', '👧', '🧒', '🧑',
];
