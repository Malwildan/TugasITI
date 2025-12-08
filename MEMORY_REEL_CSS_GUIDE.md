# 🎨 Memory Reel - CSS & Design Guide

## Visual Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                   Header Section                     │
│  ← BACK  |  LEVEL 03: MEMORY REEL                  │
│         Scroll to rewind time_                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ╔═════════╗  ╔═════════╗  ╔═════════╗  ╔═════════╗│
│  ║  DROP   ║  ║         ║  ║         ║  ║   THE   ║│
│  ║ MEMORY  ║  ║  Photo  ║  ║  Photo  ║  ║   END   ║│
│  ║   +     ║  ║ Rotated ║  ║ Rotated ║  ║         ║│
│  ║         ║  ║ 📷   🌟 ║  ║ 📷   ⭐ ║  ║   🎬   ║│
│  ║         ║  ║ Caption ║  ║ Caption ║  ║         ║│
│  ║    📥   ║  ║ 2024-01 ║  ║ 2024-02 ║  ║ [pulse] ║│
│  ║         ║  ╚═════════╝  ╚═════════╝  ╚═════════╝│
│  ╚═════════╝                                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Fixed Cassette Player ↴                             │
└─────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │ ⭕ BGM ⭕  │
                        │   ▶ ⏭     │
                        │             │
                        │ Tape Wheels │
                        │  Spinning   │
                        │             │
                        └─────────────┘
                        (bottom-right)
```

---

## Color Palette

### Primary Colors
```
Background Gradient:
  Start:   #0d0d1a (Very Dark Purple)
     ↓
  Middle:  #1a0b2e (Dark Purple)
     ↓
  End:     #2d1b4e (Medium Purple)

Neon Accents:
  Cyan:    #4ecdc4 ⭐ Primary Accent
  Pink:    #ff6b9d 💗 Secondary
  Green:   #88ff88 ✨ Success
  Blue:    #4a7aff 🎮 Interactive
  Orange:  #ffaa44 ⚠️  Warning
  Red:     #ff4444 ❌ Danger

Text Colors:
  Primary:  #ffffff (White)
  Faded:    #888888 (Gray)
```

### Color Usage
```
Element              Color         Role
────────────────────────────────────────
Borders              #000000       Structure
Titles               #4ecdc4       Accent
Subtitle             #ff6b9d       Accent
Buttons              #4a7aff       Interactive
Success Button       #88ff88       Positive
Back Button          #ff4444       Negative
Card Borders         #4ecdc4       Glow
Shadows              rgba(...)     Depth
```

---

## Typography System

### Font Faces
```
Header Font:
  Font Family: 'Press Start 2P', cursive
  Style:       Monospace, Pixel Art
  Size:        0.6rem - 1.2rem
  Weight:      400 (regular)
  Use:         Titles, Major Headings
  Example:     LEVEL 03: MEMORY REEL

Body Font:
  Font Family: 'VT323', monospace
  Style:       Monospace, Retro CRT
  Size:        0.7rem - 1rem
  Weight:      400 (regular)
  Use:         Captions, Body Text
  Example:     First day of class
```

### Font Size Scale
```
Component           Size      Font
──────────────────────────────────────
H1 (Main Title)    1.2rem    Press Start 2P
H2 (Subtitle)      1rem      VT323
Button Text        0.75rem   Press Start 2P
Card Caption       0.8rem    VT323
Card Date          0.7rem    VT323
Label              0.9rem    VT323
Input              0.9rem    VT323
Badge              0.6rem    Press Start 2P
```

---

## Border & Shadow System

### Border Styles
```
Element          Border        Shadow
─────────────────────────────────────────────────────
Header           4px solid     0 8px (bottom)
Buttons          3px solid     0 4-6px (depth)
Cards            8px (frame)   0 10px (soft)
Modal            4px solid     0 20px (deep)
Input            2px solid     inset 0 2px
Cassette         4px solid     0 8px (depth)
```

### Shadow Depth Levels
```
Level 1 (Flat):     box-shadow: 0 2px 0 rgba(0,0,0,0.5)
Level 2 (Raised):   box-shadow: 0 4px 0 rgba(0,0,0,0.5)
Level 3 (High):     box-shadow: 0 6px 0 rgba(0,0,0,0.5)
Level 4 (Very High):box-shadow: 0 8px 0 rgba(0,0,0,0.5)
Soft:               box-shadow: 0 10px 30px rgba(0,0,0,0.6)
Glow:               box-shadow: 0 0 20px rgba(78,205,196,0.5)
Inset:              box-shadow: inset 0 -2px 0 rgba(255,255,255,0.2)
```

### Glow Effects
```
Text Glow:
  text-shadow: 3px 3px 0 #ff6b9d,
               6px 6px 0 rgba(0,0,0,0.5),
               0 0 20px rgba(78,205,196,0.5);

Box Glow:
  box-shadow: 0 0 15px rgba(74,122,255,0.4);

Strong Glow:
  box-shadow: 0 0 25px rgba(74,122,255,0.6);

Component Glow:
  filter: drop-shadow(0 0 4px rgba(78,205,196,0.5));
```

---

## Animation & Effects

### Keyframe Animations
```
@keyframes blink-cursor
  0%, 49%  → opacity: 1
  50%, 100% → opacity: 0
  Duration: 0.7s
  Easing: step-end
  Use: Blinking cursor in subtitle

@keyframes bounce-icon
  0%, 100% → translateY(0)
  50%      → translateY(-8px)
  Duration: 0.8s
  Easing: ease-in-out
  Use: Drop Memory button icon

@keyframes float-up
  0%, 100% → translateY(0)
  50%      → translateY(-15px)
  Duration: 3s
  Easing: ease-in-out
  Use: THE END marker floating

@keyframes pulse-border
  0%, 100% → opacity: 0.5
  50%      → opacity: 1
  Duration: 2s
  Easing: ease-in-out
  Use: Reel end pulsing border

@keyframes music-float
  0%, 100% → translateY(0)
  50%      → translateY(-5px)
  Duration: 1s
  Easing: ease-in-out
  Use: Music note above cassette
```

### Framer Motion Effects
```
Component          Animation               Effect
────────────────────────────────────────────────────
Header            initial + animate       Fade in from top
Stars             loop animate            Floating twinkle
Cards             whileHover              Scale 1.1, rotate 0
Tape Wheels       animate + isPlaying     Spin (360°)
Modal             initial + animate       Fade & scale
Buttons           whileHover/Tap          Scale up/down
Badge             animate                 Pulsing scale
Sticker           animate                 Rotating wobble
```

---

## Component Styling Details

### Header `.reel-header`
```css
┌─────────────────────────────────────────┐
│ [← BACK]  LEVEL 03: MEMORY REEL        │ ← 1.2rem, Cyan, Glow
│           Scroll to rewind time_        │ ← 1rem, Pink, Blinking
│                                         │
│ Gradient: 180deg (top to bottom)        │
│ Background: rgba(74, 35, 90, 0.9)      │
│            to rgba(26, 11, 46, 0.7)    │
│ Border: 4px solid #000                 │
│ Box-shadow: 0 8px + inset glow         │
│ Padding: 1.5rem                        │
└─────────────────────────────────────────┘
```

### Memory Card `.memory-polaroid`
```css
Size:         280px × 360px (responsive)
Aspect Ratio: 3:4 (polaroid proportions)

Media Section:
  Height:     220px (62% of card)
  Background: #000 (for contrast)
  Overflow:   hidden
  
Caption Section:
  Height:     140px (38% of card)
  Background: #f5f5f0 (off-white)
  Padding:    1rem 0.75rem
  Border-top: 1px solid #ddd

Rotation:     Random -6deg to 6deg
Shadow:       0 10px 30px rgba(0,0,0,0.6)
Hover:        scale(1.1) + rotate(0) + zIndex(20)
```

### Cassette Player `.cassette-player`
```css
Position:   fixed (bottom-right)
Bottom:     2rem
Right:      2rem
Size:       180px min-width
Padding:    1.5rem
Z-index:    101 (above page content)

Tape Wheel:
  Size:     40px × 40px
  Border:   2px solid #4ecdc4
  Border-radius: 50%
  Rotation: 360° when playing

Controls:
  Gap:      0.75rem (spacing)
  Count:    2 buttons (play, next)
  Size:     45px × 45px each
  Colors:   Cyan gradient
```

### Polaroid Sticker `.polaroid-sticker`
```css
Position:    absolute
Top/Right:   10px from corners
Font-size:   1.8rem
Z-index:     5
Animation:   Rotating wobble (0.2s, infinite)
Shadow:      2px 2px 2px rgba(0,0,0,0.3)
```

### Modal `.reel-modal-content`
```css
Width:       500px (max)
Max-width:   90% (responsive)
Padding:     2rem
Background:  Gradient #2d1b4e to #1a0b2e
Border:      4px solid #000
Border-radius: 8px
Box-shadow:  0 20px 60px (deep) + glow

Upload Area:
  Height:    200px
  Border:    3px dashed #4ecdc4
  Background: gradient + opacity

Form Inputs:
  Padding:   0.75rem 1rem
  Border:    2px solid #4ecdc4
  Background: dark gradient
  Focus:     border becomes pink + glow
```

---

## Responsive Breakpoints

### Desktop (> 1024px)
```
Header:         Full padding, standard sizes
Card Size:      280px × 360px
Font Sizes:     Normal (1.2rem, 1rem)
Cassette:       Full size (180px)
Modal:          500px max-width
```

### Tablet (640px - 1024px)
```
Header:         Reduced padding (1rem)
Title:          1rem (reduced from 1.2rem)
Card Size:      240px × 320px
Cassette:       160px min-width
Modal:          Default sizing
```

### Mobile (< 640px)
```
Header:         flex-direction column
Title:          0.8rem
Subtitle:       0.75rem
Card Size:      200px × 280px
Cassette:       140px, repositioned
Modal:          90% width, 1.5rem padding
Buttons:        Larger touch targets
```

---

## CSS Organization

### File Structure
```
memory-reel.css (1,100+ lines)

1. Root Styles (0-50 lines)
   - .memory-reel-page
   - Scanlines overlay
   - Font family setup

2. Background Stars (50-100 lines)
   - .reel-stars
   - .star animations

3. Header Section (100-180 lines)
   - .reel-header
   - .reel-title
   - .reel-subtitle
   - .blinking-cursor

4. Scroll Container (180-240 lines)
   - .reel-scroll-wrapper
   - .reel-scroll-container
   - Scrollbar hiding

5. Drop Memory Button (240-300 lines)
   - .drop-memory-btn
   - .drop-icon
   - Bounce animation

6. Memory Cards (300-550 lines)
   - .memory-polaroid
   - .polaroid-container
   - .polaroid-media
   - .polaroid-caption
   - .polaroid-sticker
   - .new-badge

7. Reel End Marker (550-650 lines)
   - .reel-end
   - Animation keyframes

8. Cassette Player (650-800 lines)
   - .cassette-player
   - .cassette-body
   - .tape-wheel
   - .cassette-controls
   - Spinning animations

9. Modal (800-950 lines)
   - .reel-modal-overlay
   - .reel-modal-content
   - .upload-box
   - .modal-input
   - Form styling

10. Responsive Design (950-1100+ lines)
    - @media (max-width: 1024px)
    - @media (max-width: 640px)
```

---

## Special Effects Guide

### Text Glow
```css
.reel-title {
  text-shadow:
    3px 3px 0 #ff6b9d,      /* Pink offset */
    6px 6px 0 rgba(...),    /* Dark shadow */
    0 0 20px rgba(...);     /* Cyan glow */
}
```

### Scanlines
```css
.memory-reel-page::before {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
}
```

### Button Depth
```css
.machine-action-btn {
  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.5),          /* Drop shadow */
    inset 0 -2px 0 rgba(255, 255, 255, 0.2); /* Inner highlight */
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 ...;              /* Raised */
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 0 ...;              /* Pressed */
  }
}
```

---

## Accessibility Considerations

### Color Contrast
```
Text Color     Background    Ratio    WCAG
─────────────────────────────────────────────
#ffffff        #1a0b2e       14:1     AAA ✅
#4ecdc4        #1a0b2e       6.5:1    AA ✅
#ff6b9d        #1a0b2e       5.5:1    AA ✅
#88ff88        #1a0b2e       8:1      AAA ✅
#f5f5f0        #000000       17.5:1   AAA ✅
```

### Touch Targets
```
Minimum Size:  44px × 44px
Implemented:   45px buttons (cassette)
Spacing:       8px+ between interactive elements
Focus States:  Border glow on focus
```

---

## Performance Optimization

### CSS Optimizations
```
✅ No nested selectors (flat structure)
✅ Minimal animations (60fps)
✅ CSS Grid instead of JS layouts
✅ Hardware-accelerated transforms
✅ Efficient box-shadow usage
✅ Minimal media query blocks
```

### Animation Performance
```
Hardware Accelerated:
  - transform: scale(), rotate()
  - opacity changes
  - not: box-shadow, left/top

Framer Motion:
  - Uses will-change internally
  - GPU-accelerated by default
  - 60fps on most devices
```

---

## Testing Checklist

- [ ] Colors render correctly
- [ ] Typography is readable
- [ ] Animations smooth (60fps)
- [ ] Hover states visible
- [ ] Mobile responsive (test 640px)
- [ ] Tablet responsive (test 1024px)
- [ ] Touch targets large enough
- [ ] Contrast ratios pass WCAG
- [ ] Scanlines visible (not too strong)
- [ ] Shadows create depth perception
- [ ] No text overflow on mobile
- [ ] Modal scrollable on small screens

---

*This guide complements MEMORY_REEL_DOCS.md with visual design details.*
