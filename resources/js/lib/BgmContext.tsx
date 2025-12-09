import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchUserSettings, updateUserSettings } from './supabase-data';
import { useAuth } from './auth';

interface BgmContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  bgmUrl: string;
  setBgmUrl: (url: string) => Promise<void>;
  volume: number;
  setVolume: (vol: number) => void;
  showBgmModal: boolean;
  setShowBgmModal: (show: boolean) => void;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

export const DEFAULT_BGM_URL = '/audio/default_bgm.mp3'; // Place your file in public/audio/default.mp3
// const DEFAULT_BGM_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export function BgmProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmUrl, setBgmUrlState] = useState(DEFAULT_BGM_URL);
  const [volume, setVolumeState] = useState(0.5);
  const [showBgmModal, setShowBgmModal] = useState(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.src = bgmUrl; // Set initial source
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Load settings when user changes
  useEffect(() => {
    if (user) {
      fetchUserSettings().then(settings => {
        if (settings) {
          if (settings.bgm_url) {
            setBgmUrlState(settings.bgm_url);
            if (audioRef.current) audioRef.current.src = settings.bgm_url;
          }
          setVolumeState(settings.bgm_volume);
          if (audioRef.current) audioRef.current.volume = settings.bgm_volume;
        }
      });
    } else {
      // Stop if logged out
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [user]);

  const togglePlay = () => {
    if (audioRef.current && bgmUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play error", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setBgmUrl = async (url: string) => {
    setBgmUrlState(url);
    if (audioRef.current) {
      audioRef.current.src = url;
      if (isPlaying) audioRef.current.play();
    }
    await updateUserSettings({ bgmUrl: url });
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
    updateUserSettings({ bgmVolume: vol }).catch(console.error);
  };

  return (
    <BgmContext.Provider value={{ 
      isPlaying, togglePlay, bgmUrl, setBgmUrl, volume, setVolume, 
      showBgmModal, setShowBgmModal 
    }}>
      {children}
    </BgmContext.Provider>
  );
}

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) throw new Error('useBgm must be used within BgmProvider');
  return context;
};
