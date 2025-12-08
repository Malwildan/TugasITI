# 🎬 Memory Reel Refactor - Quick Reference

## Class Name Changes

### Header Section
```
OLD                          NEW
────────────────────────────────────
reel-header            →     memory-header
reel-header-content    →     header-content
reel-header-text       →     header-text
reel-title             →     memory-title
reel-subtitle          →     memory-subtitle
(added)                →     memory-loading-bar-container
(added)                →     memory-loading-bar
(added)                →     memory-loading-fill
```

### Scroll Area & Cards
```
OLD                          NEW
────────────────────────────────────
reel-scroll-wrapper    →     film-scroll-wrapper
reel-scroll-container  →     film-scroll-content
drop-memory-btn        →     add-memory-slot
(added)                →     film-strip-container
(added)                →     sprocket-holes
(added)                →     slot-text
(added)                →     slot-icon
(added)                →     slot-cursor
```

### Memory Cards
```
OLD                          NEW
────────────────────────────────────
memory-polaroid        →     scrapbook-entry
polaroid-container     →     (removed)
polaroid-media         →     entry-media
polaroid-caption       →     entry-caption
polaroid-sticker       →     (removed - replaced with washi-tape)
(added)                →     washi-tape
```

### Player & Modal
```
OLD                          NEW
────────────────────────────────────
cassette-player        →     mini-walkman
cassette-body          →     (removed)
cassette-controls      →     walkman-controls
cassette-btn           →     walkman-btn
(added)                →     walkman-screen
(added)                →     walkman-wheels
reel-modal-overlay     →     memory-modal-overlay
reel-modal-content     →     memory-modal-box
modal-close            →     modal-close-btn
upload-box             →     upload-area
(added)                →     upload-preview
(added)                →     upload-placeholder
(added)                →     upload-icon
reel-end               →     film-end-marker
end-icon               →     end-emoji
```

---

## CSS Selectors - Quick Lookup

### Main Components
- `.memory-reel-page` - Root container
- `.memory-header` - Header section (matches StatLab)
- `.film-strip-container` - Main content wrapper
- `.film-scroll-wrapper` - Horizontal scroll area
- `.film-scroll-content` - Flex container for cards
- `.scrapbook-entry` - Individual memory card
- `.mini-walkman` - Fixed position player

### Decorative Elements
- `.memory-scanlines` - CRT scanlines overlay
- `.sprocket-holes` - Film track dots (top/bottom)
- `.washi-tape` - Colored tape stripe on cards
- `.film-end-marker` - End of film marker

### Buttons & Slots
- `.back-arcade-btn` - Back button in header
- `.add-memory-slot` - Dashed border insert slot
- `.walkman-btn` - Player control buttons
- `.modal-submit-btn` - Form submit button

### Typography
- `.memory-title` - "LEVEL 03: MEMORY REEL"
- `.memory-subtitle` - "Scroll through the film..."
- `.caption-text` - Memory card caption
- `.caption-date` - Memory card date
- `.new-badge` - "NEW!" indicator

### Forms & Modal
- `.memory-modal-overlay` - Backdrop
- `.memory-modal-box` - Modal container
- `.upload-area` - Image upload zone
- `.form-input` - Text input fields
- `.form-label` - Input labels

---

## Color Palette

### Washi Tape Colors
```javascript
[
  '#ff6b9d',  // Hot Pink
  '#4ecdc4',  // Cyan
  '#ffaa44',  // Orange
  '#88ff88',  // Neon Green
  '#4a7aff'   // Blue
]
```

### Standard Colors
```
Background:     #1a0b2e (dark arcade)
Primary:        #4ecdc4 (cyan)
Secondary:      #ff6b9d (hot pink)
Accent:         #88ff88 (green)
White:          #fff
Black:          #000
```

---

## Animation Keyframes

### New Animations
```css
@keyframes blink-cursor       /* Cursor blinking effect */
@keyframes pulse-marker       /* Film end marker pulse */
@keyframes float-marker       /* Film end marker floating */
```

### Existing (from component)
- Scrapbook card entrance: opacity & scale
- Walkman wheel spinning: rotate 360°
- Badge pulsing: scale animation
- Hover effects: scale 1.1 & rotate 0

---

## Responsive Breakpoints

### Desktop (1400px+)
- Full-size cards (240px)
- Large gaps (2rem)
- Full walkman size

### Tablet (1024px)
- Medium cards (200px)
- Medium gaps (1.5rem)
- Compact walkman

### Mobile (640px)
- Small cards (160px)
- Minimal gaps (1rem)
- Mini walkman (120px)
- Optimized touch targets

---

## Loading Bar Progress

The `scrollProgress` state tracks horizontal scroll position:

```javascript
// Formula used in handleScroll
const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100
// Applied as inline style
width: `${scrollProgress}%`
```

This creates a real-time visual indicator of scroll position matching StatLab design.

---

## Migration Checklist

For implementers upgrading from old to new code:

- [ ] Update all class names in JSX
- [ ] Replace memory-reel.css entirely
- [ ] Add `scrollProgress` state variable
- [ ] Add `getRandomTapeColor()` function
- [ ] Add `getRandomTilt()` function
- [ ] Add `handleScroll()` function to wrapper
- [ ] Update all ref names (scrollContainerRef)
- [ ] Verify all components render with new classes
- [ ] Test responsive design at 1024px & 640px
- [ ] Add audio file to `/public/music/memories.mp3`
- [ ] Test scroll progress bar animation
- [ ] Verify washi tape colors display correctly
- [ ] Test walkman animations (spinning wheels, buttons)
- [ ] Validate modal form functionality

---

## Browser Compatibility

✅ Modern browsers (Chrome, Firefox, Safari, Edge)
✅ CSS Grid & Flexbox support
✅ CSS Custom Properties
✅ Motion & Framer Motion
✅ Smooth scroll behavior
✅ Backdrop filter (with fallback)

⚠️ Note: Backdrop filter may need fallback for older browsers

---

## Performance Tips

1. **Lazy load images** in scrapbook cards
2. **Throttle scroll handler** if adding heavy computations
3. **Memoize card components** to prevent unnecessary re-renders
4. **Use CSS containment** on scrapbook-entry for faster rendering
5. **Optimize audio file** (compress MP3, consider streaming)

---

## Debugging Guide

### Issue: Loading bar doesn't move
- Check `handleScroll` function is bound to ref
- Verify `scrollProgress` state is being updated
- Check CSS for `memory-loading-fill` width property

### Issue: Cards not displaying colors
- Ensure `getRandomTapeColor()` returns from TAPE_COLORS array
- Check inline style is applied to washi-tape element
- Verify CSS is loading (check DevTools for memory-reel.css)

### Issue: Walkman not spinning
- Check `isPlaying` state updates correctly
- Verify Framer Motion animation triggers based on `isPlaying`
- Check CSS for `walkman-wheels` styling

### Issue: Cursor not blinking
- Verify `slot-cursor` class has animation applied
- Check animation duration (0.6s step-end infinite)
- Confirm Framer Motion animate prop works

---

*Quick Reference Guide for Memory Reel Refactor*
*Use alongside REFACTOR_SUMMARY.md for complete documentation*
