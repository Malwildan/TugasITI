import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions
export type MbtiType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type DrinkType = 'Coffee' | 'Tea' | 'Soda' | 'Juice' | 'Water' | 'EnergyDrink' | 'Milk' | 'Smoothie';
export type ZodiacType = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

interface Sticker {
  id: string;
  emoji: string;
  name: string;
  from?: string;
}

export interface Classmate {
  id: string;
  fullName: string;
  nickname: string;
  photo: string;
  birthday: string; // YYYY-MM-DD format
  zodiac: ZodiacType;
  mbti: MbtiType;
  favoriteDrink: DrinkType;
  socialLinks: {
    instagram?: string;
  };
  badges: Badge[];
  stickersReceived: Sticker[];
  playerNumber: number;
}

// Badge definitions - these can be unlocked by other players
const ALL_BADGES: Badge[] = [
  { id: 'star', name: 'Star Player', icon: '⭐', color: '#ffd700', unlocked: false },
  { id: 'creative', name: 'Creative Soul', icon: '🎨', color: '#ff8888', unlocked: false },
  { id: 'chill', name: 'Chill Vibes', icon: '😎', color: '#88d8ff', unlocked: false },
  { id: 'gamer', name: 'Gamer Pro', icon: '🎮', color: '#b088ff', unlocked: false },
  { id: 'social', name: 'Social Butterfly', icon: '🦋', color: '#88ffb8', unlocked: false },
  { id: 'foodie', name: 'Foodie', icon: '🍔', color: '#ffb888', unlocked: false },
  { id: 'music', name: 'Music Lover', icon: '🎵', color: '#ff88d8', unlocked: false },
  { id: 'smart', name: 'Big Brain', icon: '🧠', color: '#88ffd8', unlocked: false },
];

// Sticker options for sending
const STICKER_OPTIONS: Sticker[] = [
  { id: '1', emoji: '💖', name: 'Love' },
  { id: '2', emoji: '⭐', name: 'Star' },
  { id: '3', emoji: '🎉', name: 'Party' },
  { id: '4', emoji: '🎮', name: 'Game' },
  { id: '5', emoji: '🌟', name: 'Sparkle' },
  { id: '6', emoji: '💫', name: 'Magic' },
  { id: '7', emoji: '🔥', name: 'Fire' },
  { id: '8', emoji: '✨', name: 'Shine' },
  { id: '9', emoji: '🐱', name: 'Cat' },
  { id: '10', emoji: '🦋', name: 'Butterfly' },
  { id: '11', emoji: '🌈', name: 'Rainbow' },
  { id: '12', emoji: '🍀', name: 'Lucky' },
];

// Placeholder avatar
const PLACEHOLDER_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3QgZmlsbD0iIzJhMmE0ZSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4ODhmZiIgZm9udC1zaXplPSI4MCI+8J+RpDwvdGV4dD48L3N2Zz4=';

// Sample classmates data dengan real MBTI, zodiac, dan drink
const INITIAL_CLASSMATES: Classmate[] = [];

export default function Classmates() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load initial data from localStorage or use INITIAL_CLASSMATES
  const loadInitialClassmates = (): Classmate[] => {
    try {
      const saved = localStorage.getItem('classmates');
      return saved ? JSON.parse(saved) : INITIAL_CLASSMATES;
    } catch (e) {
      console.error('Failed to load classmates:', e);
      return INITIAL_CLASSMATES;
    }
  };

  const loadInitialUserProfile = (): Classmate | null => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to load user profile:', e);
      return null;
    }
  };

  // State
  const [classmates, setClassmates] = useState<Classmate[]>(loadInitialClassmates);
  const [userProfile, setUserProfile] = useState<Classmate | null>(loadInitialUserProfile);
  const [bffs, setBffs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showBffsOnly, setShowBffsOnly] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hasProfile') === 'true';
    } catch {
      return false;
    }
  });
  
  // Modal states
  const [selectedPlayer, setSelectedPlayer] = useState<Classmate | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    nickname: '',
    birthday: '',
    mbti: 'INTJ' as MbtiType,
    zodiac: 'Aries' as ZodiacType,
    favoriteDrink: 'Coffee' as DrinkType,
    instagram: '',
  });
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  
  // Toast
  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);

  // Save classmates to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('classmates', JSON.stringify(classmates));
    } catch (e) {
      console.error('Failed to save classmates:', e);
    }
  }, [classmates]);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('userProfile');
      }
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  }, [userProfile]);

  // Save hasProfile flag to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hasProfile', hasProfile ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save hasProfile flag:', e);
    }
  }, [hasProfile]);

  // Filter classmates
  const filteredClassmates = classmates.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBff = !showBffsOnly || bffs.has(c.id);
    return matchesSearch && matchesBff;
  });

  // Show toast notification
  const showToast = (message: string, emoji: string) => {
    setToast({ message, emoji });
    setTimeout(() => setToast(null), 2500);
  };

  // Toggle BFF
  const toggleBff = (id: string, nickname: string) => {
    const newBffs = new Set(bffs);
    if (newBffs.has(id)) {
      newBffs.delete(id);
      showToast(`${nickname} removed from BFFs`, '💔');
    } else {
      newBffs.add(id);
      showToast(`${nickname} added to BFFs!`, '💝');
    }
    setBffs(newBffs);
  };

  // Send sticker to player
  const sendSticker = (sticker: Sticker) => {
    if (!selectedPlayer) return;
    
    const newSticker = { ...sticker, from: 'You' };
    setClassmates(prev => prev.map(c => 
      c.id === selectedPlayer.id 
        ? { ...c, stickersReceived: [...c.stickersReceived, newSticker] }
        : c
    ));
    
    // Update selected player view
    setSelectedPlayer(prev => prev ? {
      ...prev,
      stickersReceived: [...prev.stickersReceived, newSticker]
    } : null);
    
    showToast(`Sent ${sticker.emoji} to ${selectedPlayer.nickname}!`, '🎁');
    setShowStickerPicker(false);
  };

  // Unlock badge for player
  const unlockBadge = (badge: Badge) => {
    if (!selectedPlayer) return;
    
    // Check if already unlocked
    const alreadyHas = selectedPlayer.badges.some(b => b.id === badge.id);
    if (alreadyHas) {
      showToast(`${selectedPlayer.nickname} already has this badge!`, '❌');
      return;
    }
    
    const unlockedBadge = { ...badge, unlocked: true };
    setClassmates(prev => prev.map(c => 
      c.id === selectedPlayer.id 
        ? { ...c, badges: [...c.badges, unlockedBadge] }
        : c
    ));
    
    setSelectedPlayer(prev => prev ? {
      ...prev,
      badges: [...prev.badges, unlockedBadge]
    } : null);
    
    showToast(`Unlocked ${badge.icon} for ${selectedPlayer.nickname}!`, '🔓');
    setShowBadgePicker(false);
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile
  const handleSubmitProfile = () => {
    if (!profileForm.fullName.trim() || !profileForm.nickname.trim() || !profileForm.birthday) {
      showToast('Please fill in all required fields!', '❌');
      return;
    }

    const newPlayer: Classmate = {
      id: `user-${Date.now()}`,
      fullName: profileForm.fullName.trim(),
      nickname: profileForm.nickname.trim(),
      photo: previewPhoto || '',
      birthday: profileForm.birthday,
      mbti: profileForm.mbti,
      zodiac: profileForm.zodiac,
      favoriteDrink: profileForm.favoriteDrink,
      socialLinks: { instagram: profileForm.instagram.trim() || undefined },
      badges: [],
      stickersReceived: [],
      playerNumber: classmates.length + 1,
    };

    setUserProfile(newPlayer); // Store user's profile separately
    setClassmates(prev => [...prev, newPlayer]);
    setHasProfile(true);
    setShowProfileForm(false);
    setProfileForm({ fullName: '', nickname: '', birthday: '', mbti: 'INTJ', zodiac: 'Aries', favoriteDrink: 'Coffee', instagram: '' });
    setPreviewPhoto(null);
    showToast('Welcome to the roster! 🎮', '✨');
  };

  return (
    <div className="classmates-page">
      {/* Toast */}
      {toast && (
        <div className="arcade-toast">
          <span className="toast-emoji">{toast.emoji}</span>
          <span className="toast-msg">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="classmates-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← BACK
          </button>
          <div className="header-title">
            <h1>LEVEL 01: CLASS ROSTER</h1>
            <p className="header-desc">Analyzing Student Profiles...</p>
          </div>
          <div className="header-stats">
            <span className="stat-box">
              <span className="stat-label">TOTAL</span>
              <span className="stat-num">{classmates.length}</span>
            </span>
            <span className="stat-box">
              <span className="stat-label">BFFs</span>
              <span className="stat-num">{bffs.size}</span>
            </span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div 
            className="loading-bar-fill"
            style={{ width: classmates.length > 0 ? '100%' : '20%' }}
          />
        </div>
      </header>

      {/* Controls */}
      <div className="classmates-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          className={`filter-btn ${showBffsOnly ? 'active' : ''}`}
          onClick={() => setShowBffsOnly(!showBffsOnly)}
        >
          {showBffsOnly ? '💝 BFFs ONLY' : '👥 ALL PLAYERS'}
        </button>
      </div>

      <div className="main-content">
        {/* Warning: Add Your Profile */}
        {!hasProfile && (
          <div className="add-profile-warning">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3 className="warning-title">YOU'RE NOT IN THE ROSTER YET!</h3>
              <p className="warning-text">Add your profile so your classmates can find you, send you stickers, and unlock badges for you!</p>
            </div>
            <button 
              className="add-profile-btn"
              onClick={() => setShowProfileForm(true)}
            >
              🎮 ADD YOUR PROFILE
            </button>
          </div>
        )}

      {/* Your Profile Card */}
      {hasProfile && userProfile && (
        <div className="your-profile-card">
          <div className="your-profile-header">
            <span className="your-profile-title">🎮 YOUR PROFILE</span>
            <button 
              className="edit-profile-btn"
              onClick={() => setShowProfileForm(true)}
              title="Edit Profile"
            >
              ✏️ EDIT
            </button>
          </div>
          <div className="your-profile-content">
            <div className="your-profile-info">
              <h3 className="your-profile-name">{userProfile.nickname}</h3>
              <p className="your-profile-fullname">{userProfile.fullName}</p>
            </div>
            <div className="your-profile-stats">
              <div className="your-profile-stat">
                <span className="stat-label">Zodiac</span>
                <span className="stat-value">{userProfile.zodiac}</span>
              </div>
              <div className="your-profile-stat">
                <span className="stat-label">MBTI</span>
                <span className="stat-value">{userProfile.mbti}</span>
              </div>
              <div className="your-profile-stat">
                <span className="stat-label">Favorite Drink</span>
                <span className="stat-value">{userProfile.favoriteDrink}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Grid */}
      <div className="players-grid">
        {filteredClassmates.map((player) => (
          <div key={player.id} className="player-card">
            {/* BFF Button */}
            <button 
              className={`bff-btn ${bffs.has(player.id) ? 'is-bff' : ''}`}
              onClick={() => toggleBff(player.id, player.nickname)}
              title={bffs.has(player.id) ? 'Remove from BFFs' : 'Add to BFFs'}
            >
              {bffs.has(player.id) ? '💝' : '🤍'}
            </button>

            {/* Player Number */}
            <div className="player-num">
              PLAYER {String(player.playerNumber).padStart(2, '0')}
            </div>

            {/* Photo - SQUARE 1:1 */}
            <div className="player-photo-square" onClick={() => setSelectedPlayer(player)}>
              <img 
                src={player.photo || PLACEHOLDER_AVATAR} 
                alt={player.nickname}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_AVATAR;
                }}
              />
            </div>

            {/* Info */}
            <h3 className="player-nickname">{player.nickname}</h3>
            <p className="player-fullname">{player.fullName}</p>

            {/* Badges Display */}
            <div className="player-badges-row">
              {player.badges.slice(0, 4).map((badge) => (
                <span 
                  key={badge.id} 
                  className="badge-icon"
                  style={{ backgroundColor: badge.color }}
                  title={badge.name}
                >
                  {badge.icon}
                </span>
              ))}
              {player.badges.length > 4 && (
                <span className="badge-more">+{player.badges.length - 4}</span>
              )}
            </div>

            {/* Stickers Received Preview */}
            {player.stickersReceived.length > 0 && (
              <div className="stickers-preview">
                {player.stickersReceived.slice(0, 5).map((s, i) => (
                  <span key={i} className="sticker-mini">{s.emoji}</span>
                ))}
                {player.stickersReceived.length > 5 && (
                  <span className="sticker-count">+{player.stickersReceived.length - 5}</span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="player-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => setSelectedPlayer(player)}
              >
                👁️ VIEW
              </button>
              <button 
                className="action-btn send-btn"
                onClick={() => {
                  setSelectedPlayer(player);
                  setShowStickerPicker(true);
                }}
              >
                🎁 SEND
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClassmates.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>{showBffsOnly ? 'No BFFs yet! Add some friends.' : 'No players found.'}</p>
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && !showStickerPicker && !showBadgePicker && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content player-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPlayer(null)}>
              ✕
            </button>

            {/* Player Header */}
            <div className="modal-player-header">
              <div className="modal-photo-square">
                <img 
                  src={selectedPlayer.photo || PLACEHOLDER_AVATAR} 
                  alt={selectedPlayer.nickname}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_AVATAR;
                  }}
                />
              </div>
              <div className="modal-player-info">
                <span className="modal-player-num">PLAYER {String(selectedPlayer.playerNumber).padStart(2, '0')}</span>
                <h2 className="modal-player-name">{selectedPlayer.fullName}</h2>
                <p className="modal-player-nick">@{selectedPlayer.nickname}</p>
                {selectedPlayer.socialLinks.instagram && (
                  <a 
                    href={`https://instagram.com/${selectedPlayer.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-instagram"
                  >
                    📸 {selectedPlayer.socialLinks.instagram}
                  </a>
                )}
              </div>
            </div>

            {/* BFF Toggle in Modal */}
            <button 
              className={`modal-bff-btn ${bffs.has(selectedPlayer.id) ? 'is-bff' : ''}`}
              onClick={() => toggleBff(selectedPlayer.id, selectedPlayer.nickname)}
            >
              {bffs.has(selectedPlayer.id) ? '💝 BFF' : '🤍 Add to BFFs'}
            </button>

            {/* Badges Section */}
            <div className="modal-section">
              <div className="section-header">
                <h3>🏆 BADGES ({selectedPlayer.badges.length})</h3>
                <button 
                  className="unlock-btn"
                  onClick={() => setShowBadgePicker(true)}
                >
                  🔓 UNLOCK
                </button>
              </div>
              <div className="badges-grid">
                {selectedPlayer.badges.length > 0 ? (
                  selectedPlayer.badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="badge-item"
                      style={{ borderColor: badge.color }}
                    >
                      <span className="badge-emoji">{badge.icon}</span>
                      <span className="badge-name">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No badges yet. Unlock one!</p>
                )}
              </div>
            </div>

            {/* Stickers Section */}
            <div className="modal-section">
              <div className="section-header">
                <h3>🎀 STICKERS ({selectedPlayer.stickersReceived.length})</h3>
                <button 
                  className="send-sticker-btn"
                  onClick={() => setShowStickerPicker(true)}
                >
                  🎁 SEND
                </button>
              </div>
              <div className="stickers-grid">
                {selectedPlayer.stickersReceived.length > 0 ? (
                  selectedPlayer.stickersReceived.map((sticker, i) => (
                    <div key={i} className="sticker-item">
                      <span className="sticker-emoji">{sticker.emoji}</span>
                      {sticker.from && <span className="sticker-from">from {sticker.from}</span>}
                    </div>
                  ))
                ) : (
                  <p className="no-items">No stickers yet. Send one!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticker Picker Modal */}
      {showStickerPicker && selectedPlayer && (
        <div className="modal-overlay" onClick={() => setShowStickerPicker(false)}>
          <div className="modal-content picker-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStickerPicker(false)}>
              ✕
            </button>
            <h2 className="picker-title">🎁 Send Sticker to {selectedPlayer.nickname}</h2>
            <div className="sticker-picker-grid">
              {STICKER_OPTIONS.map((sticker) => (
                <button
                  key={sticker.id}
                  className="sticker-option"
                  onClick={() => sendSticker(sticker)}
                >
                  <span className="sticker-opt-emoji">{sticker.emoji}</span>
                  <span className="sticker-opt-name">{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badge Picker Modal */}
      {showBadgePicker && selectedPlayer && (
        <div className="modal-overlay" onClick={() => setShowBadgePicker(false)}>
          <div className="modal-content picker-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBadgePicker(false)}>
              ✕
            </button>
            <h2 className="picker-title">🔓 Unlock Badge for {selectedPlayer.nickname}</h2>
            <div className="badge-picker-grid">
              {ALL_BADGES.map((badge) => {
                const alreadyHas = selectedPlayer.badges.some(b => b.id === badge.id);
                return (
                  <button
                    key={badge.id}
                    className={`badge-option ${alreadyHas ? 'already-has' : ''}`}
                    onClick={() => !alreadyHas && unlockBadge(badge)}
                    disabled={alreadyHas}
                    style={{ borderColor: badge.color }}
                  >
                    <span className="badge-opt-emoji">{badge.icon}</span>
                    <span className="badge-opt-name">{badge.name}</span>
                    {alreadyHas && <span className="badge-owned">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Profile Form Modal */}
      {showProfileForm && (
        <div className="modal-overlay" onClick={() => setShowProfileForm(false)}>
          <div className="modal-content profile-form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfileForm(false)}>
              ✕
            </button>
            
            <h2 className="form-title">🎮 JOIN THE ROSTER!</h2>
            <p className="form-subtitle">Add your profile and become a player</p>

            {/* Photo Upload */}
            <div className="photo-upload-section">
              <div 
                className="photo-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Preview" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Click to upload photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              {previewPhoto && (
                <button 
                  className="remove-photo-btn"
                  onClick={() => setPreviewPhoto(null)}
                >
                  ✕ Remove Photo
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Zamira Nasywa U"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nickname *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nanas"
                  value={profileForm.nickname}
                  onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Birthday *</label>
                <input
                  type="date"
                  className="form-input"
                  value={profileForm.birthday}
                  onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Zodiac Sign *</label>
                <select
                  className="form-input"
                  value={profileForm.zodiac}
                  onChange={(e) => setProfileForm({ ...profileForm, zodiac: e.target.value as ZodiacType })}
                >
                  <option value="Aries">♈ Aries</option>
                  <option value="Taurus">♉ Taurus</option>
                  <option value="Gemini">♊ Gemini</option>
                  <option value="Cancer">♋ Cancer</option>
                  <option value="Leo">♌ Leo</option>
                  <option value="Virgo">♍ Virgo</option>
                  <option value="Libra">♎ Libra</option>
                  <option value="Scorpio">♏ Scorpio</option>
                  <option value="Sagittarius">♐ Sagittarius</option>
                  <option value="Capricorn">♑ Capricorn</option>
                  <option value="Aquarius">♒ Aquarius</option>
                  <option value="Pisces">♓ Pisces</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">MBTI Type *</label>
                <select
                  className="form-input"
                  value={profileForm.mbti}
                  onChange={(e) => setProfileForm({ ...profileForm, mbti: e.target.value as MbtiType })}
                >
                  <option value="INTJ">INTJ</option>
                  <option value="INTP">INTP</option>
                  <option value="ENTJ">ENTJ</option>
                  <option value="ENTP">ENTP</option>
                  <option value="INFJ">INFJ</option>
                  <option value="INFP">INFP</option>
                  <option value="ENFJ">ENFJ</option>
                  <option value="ENFP">ENFP</option>
                  <option value="ISTJ">ISTJ</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="ESTJ">ESTJ</option>
                  <option value="ESFJ">ESFJ</option>
                  <option value="ISTP">ISTP</option>
                  <option value="ISFP">ISFP</option>
                  <option value="ESTP">ESTP</option>
                  <option value="ESFP">ESFP</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Favorite Drink *</label>
                <select
                  className="form-input"
                  value={profileForm.favoriteDrink}
                  onChange={(e) => setProfileForm({ ...profileForm, favoriteDrink: e.target.value as DrinkType })}
                >
                  <option value="Coffee">☕ Coffee</option>
                  <option value="Tea">🍵 Tea</option>
                  <option value="Soda">🥤 Soda</option>
                  <option value="Juice">🧃 Juice</option>
                  <option value="Water">💧 Water</option>
                  <option value="EnergyDrink">⚡ Energy Drink</option>
                  <option value="Milk">🥛 Milk</option>
                  <option value="Smoothie">🍹 Smoothie</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Instagram (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. @nasyviie"
                  value={profileForm.instagram}
                  onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="submit-profile-btn"
              onClick={handleSubmitProfile}
            >
              ✨ JOIN ROSTER
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
