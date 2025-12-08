# 📽️ MEMORY REEL - Level 03

## Project Overview

**Memory Reel** adalah halaman Level 03 yang menampilkan digital scrapbook interaktif dengan konsep "Scroll like a music video storyboard." Pengguna dapat melihat, menambah, dan memutar musik latar sambil menjelajahi foto-foto kelas dalam format horizontal film strip.

---

## 🎨 Visual Theme

- **Aesthetic:** 8-bit Pixel Art, Dark Arcade
- **Color Palette:**
  - Primary Background: `#1a0b2e` → `#2d1b4e` (purple gradient)
  - Neon Accents:
    - Cyan: `#4ecdc4`
    - Pink: `#ff6b9d`
    - Green: `#88ff88`
    - Blue: `#4a7aff`
- **Typography:**
  - Headers: `Press Start 2P` (pixel-art font)
  - Body: `VT323` (monospace)
- **Effects:**
  - Scanlines overlay (CRT monitor aesthetic)
  - Text glow & shadow
  - Button depth shadows (3-4px)
  - Parallax star background
  - Pulsing animations

---

## 📁 File Structure

```
resources/
├── js/
│   └── Pages/
│       └── MemoryReel.tsx          # Main React component
├── css/
│   └── memory-reel.css             # Complete styling
└── (imported in app.tsx)
```

---

## 🎮 Component Features

### 1. **Horizontal Film Strip Layout**
- **Container:** `.reel-scroll-wrapper` with `overflow-x: auto` and `scroll-snap-type: x`
- **Behavior:** Smooth horizontal scrolling, hidden scrollbar for immersive feel
- **Content:** Long "infinite canvas" track with memory cards

### 2. **Memory Cards (Polaroids)**
- **Style:** White background (`bg-gray-100`) with thick padding at bottom
- **Size:** 280px × 360px (responsive on mobile)
- **Features:**
  - Random rotation (-6deg to 6deg) for natural pinned look
  - Image/video media container with 220px height
  - Caption area with text and date
  - Random emoji stickers on corners
  - "NEW!" badge with pulsing animation
- **Hover Interaction:**
  - Scale up (1.1x)
  - Rotation straightens to 0deg
  - Z-index increases to pop to front
  - Smooth 0.3s transition

### 3. **Animated Background**
- **Stars Effect:** 50 parallax stars (`✨`) with floating animation
- **Scanlines:** Fixed overlay with subtle horizontal lines
- **Parallax:** Different animation delays create depth illusion

### 4. **Header Section**
- **Title:** "LEVEL 03: MEMORY REEL"
- **Subtitle:** "Scroll to rewind time" with blinking cursor (`_`)
- **Back Button:** Red arcade button to return to Dashboard
- **Styling:** Purple gradient with thick black border and shadow

### 5. **Cassette Player Control**
- **Position:** Fixed at bottom-right corner
- **Components:**
  - Tape wheels (left & right circles with center dot)
  - Spinning animation when playing (360° rotation)
  - Center label: "BGM"
  - Play/Pause button (`▶` / `⏸`)
  - Next Track button (`⏭`)
- **Audio:** HTML5 `<audio>` tag (expects `/music/memories.mp3`)
- **Styling:** Cyan border, glowing effect, gradient background

### 6. **Add Memory Modal**
- **Trigger:** "DROP MEMORY +" button (blue mailslot-style)
- **Modal Features:**
  - Image upload with preview
  - Caption input (max 100 chars)
  - Date picker
  - Submit button (green gradient)
  - Close button (×)
- **Validation:** Submit disabled if image or caption missing
- **Animation:** Smooth fade-in and scale-up

### 7. **Drop Memory Button**
- **Style:** Blue gradient, 140px × 200px
- **Visual:** Mailslot/cartridge slot theme with bouncing icon
- **Animation:** Bounce effect on icon (`bounce-icon` keyframe)
- **Hover:** Scale and lift effect

### 8. **Reel End Marker**
- **Content:** Movie clapper emoji (`🎬`) and "THE END" text
- **Styling:** Cyan border with pulsing dashed border
- **Animation:** Floating "THE END" text
- **Purpose:** Visual closure for horizontal scroll

---

## 🧠 Data Structure

### Memory Interface
```typescript
interface Memory {
  id: string;           // Unique identifier
  type: 'image' | 'video';  // Media type
  src: string;          // Image/video URL or DataURL
  caption: string;      // Memory description
  date: string;         // Date (YYYY-MM-DD format)
  isNew?: boolean;      // New badge flag
}
```

### Initial Dummy Data
```typescript
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    caption: 'First day of class',
    date: '2024-01-15',
  },
  // ... 4 more memories
];
```

---

## 📊 State Management

### useState Hooks
```typescript
const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
const [isPlaying, setIsPlaying] = useState(false);
const [showAddModal, setShowAddModal] = useState(false);
const [newMemory, setNewMemory] = useState({ 
  caption: '', 
  date: new Date().toISOString().split('T')[0] 
});
const [previewImage, setPreviewImage] = useState<string | null>(null);
```

### useRef Hooks
```typescript
const scrollContainerRef = useRef<HTMLDivElement>(null);  // Horizontal scroll container
const audioRef = useRef<HTMLAudioElement>(null);          // Audio player
```

---

## 🎬 Key Functions

### `togglePlay()`
Toggles audio playback (play/pause)

### `handleNextTrack()`
Restarts current track or loads next one

### `handleAddMemory()`
Validates and adds new memory to `memories` array

### `handleImageUpload()`
Converts file to DataURL for preview

### `getRandomRotation()`
Returns random rotation between -6 and 6 degrees

### `getRandomSticker()`
Returns random emoji sticker from array

---

## 🎨 CSS Classes

### Main Containers
- `.memory-reel-page` - Root container with gradient background
- `.reel-scroll-wrapper` - Horizontal scroll container
- `.reel-scroll-container` - Content track (flex layout)

### Header
- `.reel-header` - Header section
- `.reel-title` - Main title with glow effect
- `.reel-subtitle` - Subtitle with blinking cursor
- `.back-arcade-btn` - Red back button

### Memory Cards
- `.memory-polaroid` - Card wrapper
- `.polaroid-container` - White polaroid frame
- `.polaroid-media` - Image/video container
- `.polaroid-caption` - Caption area
- `.polaroid-sticker` - Decorative sticker (animated)
- `.new-badge` - "NEW!" badge

### Cassette Player
- `.cassette-player` - Fixed player container
- `.cassette-body` - Tape wheels section
- `.tape-wheel` - Rotating wheel (left/right)
- `.cassette-controls` - Play/Pause buttons
- `.cassette-btn` - Control buttons

### Modal
- `.reel-modal-overlay` - Semi-transparent background
- `.reel-modal-content` - Modal box
- `.upload-box` - Image upload area
- `.modal-form-group` - Form field wrapper
- `.modal-input` - Text/date inputs

### Animations
- `@keyframes blink-cursor` - Blinking cursor effect
- `@keyframes bounce-icon` - Bouncing icon
- `@keyframes float-up` - Floating effect
- `@keyframes pulse-border` - Pulsing border
- `@keyframes music-float` - Music note floating

---

## 🎵 Audio Integration

### Setup
```typescript
const audioRef = useRef<HTMLAudioElement>(null);

<audio
  ref={audioRef}
  src="/music/memories.mp3"
  onEnded={() => setIsPlaying(false)}
/>
```

### Expected Audio File
- **Path:** `/public/music/memories.mp3`
- **Format:** MP3 (or any supported by HTML5 audio)
- **Note:** Currently using placeholder path. Add actual file to work.

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full header and cassette player
- 280px × 360px memory cards
- Standard font sizes

### Tablet (640px - 1024px)
- Reduced header padding
- Smaller title fonts (1rem instead of 1.2rem)
- 240px × 320px memory cards
- Adjusted cassette player size

### Mobile (< 640px)
- Flex-column header layout
- Minimal padding throughout
- 200px × 280px memory cards
- Simplified modal with max-width 90%
- Touch-friendly button sizes

---

## 🎯 Integration Steps

### 1. ✅ File Creation
- Created `MemoryReel.tsx` component
- Created `memory-reel.css` stylesheet

### 2. ✅ App Integration
- Imported CSS in `app.tsx`
- Added MemoryReel import
- Created `/memory-reel` route with ProtectedRoute

### 3. ✅ Dashboard Integration
- Updated Dashboard Memory Reel arcade machine button
- Connected to `/memory-reel` navigation

### 4. ⏳ Future Enhancements
- **localStorage Persistence:** Save memories to localStorage
- **Real Data Integration:** Load classmates photos as memories
- **Date Filtering:** Filter memories by date range
- **Sharing:** Export memory reel as shareable link
- **Music Upload:** Allow custom BGM uploads
- **Video Support:** Full video upload and playback
- **Emoji Reactions:** React to memories with emojis
- **Comments:** Leave comments on specific memories

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Navigate to:
# Dashboard → Gallery Machine → OPEN
# Or directly: http://localhost:5174/memory-reel
```

---

## ⚠️ Known Issues & Notes

1. **Audio File:** Current implementation expects `/music/memories.mp3`. Add actual file or update path.
2. **Dummy Data:** Initial memories use Unsplash URLs. Will display in production.
3. **localStorage:** Not yet implemented. Memories persist only during session.
4. **Mobile Scrolling:** Ensure `scroll-snap-x` works smoothly on touch devices.

---

## 🎮 Features Demo

### Add Memory Flow
1. Click "DROP MEMORY +" button
2. Click upload area to select image
3. Enter caption (max 100 chars)
4. Adjust date if needed
5. Click "💾 SAVE MEMORY"
6. New memory appears at start of reel

### Cassette Player
1. Click ▶ to play BGM
2. Tape wheels spin during playback
3. Click ⏸ to pause
4. Click ⏭ to restart/next track

### Interactive Cards
1. Hover over memory card
2. Card scales up, straightens, and pops forward
3. Click to view details (if detail modal added)
4. Some cards have decorative emoji stickers
5. Newest memories show "NEW!" badge

---

## 📝 Code Quality

- **TypeScript:** Fully typed interfaces and state
- **React Best Practices:** Hooks, useRef, useEffect
- **Framer Motion:** Smooth animations and transitions
- **CSS:** BEM-like naming convention, responsive design
- **Accessibility:** Semantic HTML, proper color contrast

---

## 🎪 Design System Alignment

Memory Reel follows the existing design system:
- ✅ Same background gradient as Classmates & StatLab
- ✅ Consistent typography (Press Start 2P + VT323)
- ✅ Unified neon color palette
- ✅ Arcade-style borders and shadows
- ✅ Scanlines overlay CRT aesthetic
- ✅ Pulsing/glow animations
- ✅ Responsive breakpoints (1024px, 640px)

---

## 🏆 Conclusion

Memory Reel brings interactive storytelling to Student Arcade with a horizontal film strip UX, animated polaroid cards, and immersive cassette player BGM control. The component seamlessly integrates with existing pages while maintaining visual consistency and providing a unique gameplay experience.

**Status:** ✅ Complete and Ready for Testing!

---

*Created with ❤️ as Level 03 of Student Arcade*
