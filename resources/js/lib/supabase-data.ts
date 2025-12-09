import { supabase } from './supabase';
import type { Classmate, MbtiType, DrinkType, ZodiacType } from '@/Pages/Classmates';

// Type definitions matching database schema
export interface DbProfile {
  id: string;
  full_name: string;
  nickname: string;
  photo_url: string | null;
  birthday: string | null;
  zodiac: ZodiacType | null;
  mbti: MbtiType | null;
  favorite_drink: DrinkType | null;
  instagram_handle: string | null;
  player_number: number;
  created_at: string;
  updated_at: string;
}

export interface DbMemory {
  id: string;
  user_id: string;
  type: 'image' | 'video';
  media_url: string;
  caption: string | null;
  memory_date: string;
  rotation: number;
  is_new: boolean;
  created_at: string;
}

export interface DbBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface DbSticker {
  id: string;
  receiver_id: string;
  sender_id: string | null;
  sticker_id: string;
  created_at: string;
}

export interface DbFavorite {
  user_id: string;
  favorite_id: string;
  created_at: string;
}

export interface DbUserSettings {
  user_id: string;
  bgm_url: string | null;
  bgm_volume: number;
  created_at: string;
  updated_at: string;
}

// Helper function to map DB profile to Classmate
export function mapProfileToClassmate(profile: DbProfile, badges: DbBadge[] = [], stickers: DbSticker[] = []): Classmate {
  return {
    id: profile.id,
    fullName: profile.full_name,
    nickname: profile.nickname,
    photo: profile.photo_url || '',
    birthday: profile.birthday || '',
    zodiac: profile.zodiac || 'Aries',
    mbti: profile.mbti || 'INTJ',
    favoriteDrink: profile.favorite_drink || 'Water',
    socialLinks: {
      instagram: profile.instagram_handle || undefined,
    },
    badges: badges.map(b => ({
      id: b.badge_id,
      name: getBadgeName(b.badge_id),
      icon: getBadgeIcon(b.badge_id),
      color: getBadgeColor(b.badge_id),
      unlocked: true,
    })),
    stickersReceived: stickers.map(s => ({
      id: s.id,
      emoji: getStickerEmoji(s.sticker_id),
      name: getStickerName(s.sticker_id),
      from: s.sender_id ? 'User' : undefined,
    })),
    playerNumber: profile.player_number,
  };
}

// Badge helper functions
function getBadgeName(badgeId: string): string {
  const badges: Record<string, string> = {
    star: 'Star Player',
    creative: 'Creative Soul',
    chill: 'Chill Vibes',
    gamer: 'Gamer Pro',
    social: 'Social Butterfly',
    foodie: 'Foodie',
    music: 'Music Lover',
    smart: 'Big Brain',
  };
  return badges[badgeId] || badgeId;
}

function getBadgeIcon(badgeId: string): string {
  const icons: Record<string, string> = {
    star: '⭐',
    creative: '🎨',
    chill: '😎',
    gamer: '🎮',
    social: '🦋',
    foodie: '🍔',
    music: '🎵',
    smart: '🧠',
  };
  return icons[badgeId] || '🏆';
}

function getBadgeColor(badgeId: string): string {
  const colors: Record<string, string> = {
    star: '#ffd700',
    creative: '#ff8888',
    chill: '#88d8ff',
    gamer: '#b088ff',
    social: '#88ffb8',
    foodie: '#ffb888',
    music: '#ff88d8',
    smart: '#88ffd8',
  };
  return colors[badgeId] || '#888888';
}

// Sticker helper functions
function getStickerEmoji(stickerId: string): string {
  const emojis: Record<string, string> = {
    '1': '💖',
    '2': '⭐',
    '3': '🎉',
    '4': '🎮',
    '5': '🌟',
    '6': '💫',
    '7': '🔥',
    '8': '✨',
    '9': '🐱',
    '10': '🦋',
    '11': '🌈',
    '12': '🍀',
  };
  return emojis[stickerId] || '❓';
}

function getStickerName(stickerId: string): string {
  const names: Record<string, string> = {
    '1': 'Love',
    '2': 'Star',
    '3': 'Party',
    '4': 'Game',
    '5': 'Sparkle',
    '6': 'Magic',
    '7': 'Fire',
    '8': 'Shine',
    '9': 'Cat',
    '10': 'Butterfly',
    '11': 'Rainbow',
    '12': 'Lucky',
  };
  return names[stickerId] || 'Sticker';
}

// === PROFILES ===

export async function fetchAllProfiles(): Promise<Classmate[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('player_number', { ascending: true });

  if (error) throw error;
  if (!profiles) return [];

  // Fetch badges and stickers for all profiles
  const profileIds = profiles.map(p => p.id);
  
  const { data: badges } = await supabase
    .from('user_badges')
    .select('*')
    .in('user_id', profileIds);

  const { data: stickers } = await supabase
    .from('stickers')
    .select('*')
    .in('receiver_id', profileIds);

  return profiles.map(p => 
    mapProfileToClassmate(
      p as DbProfile,
      badges?.filter(b => b.user_id === p.id) || [],
      stickers?.filter(s => s.receiver_id === p.id) || []
    )
  );
}

export async function fetchCurrentUserProfile(): Promise<Classmate | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;

  const { data: badges } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', user.id);

  const { data: stickers } = await supabase
    .from('stickers')
    .select('*')
    .eq('receiver_id', user.id);

  return mapProfileToClassmate(
    profile as DbProfile,
    badges || [],
    stickers || []
  );
}

export async function upsertProfile(classmate: Classmate): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const profileData = {
    id: user.id,
    full_name: classmate.fullName,
    nickname: classmate.nickname,
    photo_url: classmate.photo || null,
    birthday: classmate.birthday || null,
    zodiac: classmate.zodiac,
    mbti: classmate.mbti,
    favorite_drink: classmate.favoriteDrink,
    instagram_handle: classmate.socialLinks.instagram || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(profileData);

  if (error) throw error;
}

// === BADGES ===

export async function unlockBadge(userId: string, badgeId: string): Promise<void> {
  const { error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId,
    });

  if (error && error.code !== '23505') { // Ignore duplicate key error
    throw error;
  }
}

// === STICKERS ===

export async function sendSticker(receiverId: string, stickerId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('stickers')
    .insert({
      receiver_id: receiverId,
      sender_id: user.id,
      sticker_id: stickerId,
    });

  if (error) throw error;
}

// === FAVORITES ===

export async function fetchFavorites(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('favorite_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return data?.map(f => f.favorite_id) || [];
}

export async function toggleFavorite(favoriteId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('favorite_id', favoriteId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('favorite_id', favoriteId);

    if (error) throw error;
    return false;
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        favorite_id: favoriteId,
      });

    if (error) throw error;
    return true;
  }
}

// === MEMORIES ===

export async function fetchMemories(): Promise<DbMemory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('memory_date', { ascending: false });

  if (error) throw error;
  return (data as DbMemory[]) || [];
}

export async function addMemory(memory: {
  type: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  date: string;
  rotation?: number;
}): Promise<DbMemory> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: user.id,
      type: memory.type,
      media_url: memory.mediaUrl,
      caption: memory.caption,
      memory_date: memory.date,
      rotation: memory.rotation || 0,
      is_new: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DbMemory;
}

export async function updateMemory(id: string, updates: { caption?: string; memory_date?: string; is_new?: boolean }): Promise<void> {
  const { error } = await supabase
    .from('memories')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// === USER SETTINGS ===

export async function fetchUserSettings(): Promise<DbUserSettings | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore not found
  return data as DbUserSettings | null;
}

export async function updateUserSettings(settings: { bgmUrl?: string; bgmVolume?: number }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updates: any = { updated_at: new Date().toISOString() };
  if (settings.bgmUrl !== undefined) updates.bgm_url = settings.bgmUrl;
  if (settings.bgmVolume !== undefined) updates.bgm_volume = settings.bgmVolume;

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      ...updates,
    });

  if (error) throw error;
}

// === STORAGE ===

export async function uploadFile(bucket: 'avatars' | 'memories' | 'bgm', file: File, path?: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = path || `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
