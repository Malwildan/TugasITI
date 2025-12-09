# Setup
This repo has been converted to a standalone React + Vite + Tailwind project.

## Prerequisites
- Node.js 18+
- npm

## Install and Run
```powershell
npm install
npm run dev
```
App runs at http://localhost:5173.

## Build
```powershell
npm run build
```
Outputs to `dist/`.

## Project Structure
- `index.html`: Vite entry
- `resources/js/app.tsx`: React root
- `resources/css/app.css`: Tailwind styles
- `tailwind.config.js`, `postcss.config.js`: Tailwind/PostCSS config

## Notes
- Laravel/PHP backend files were removed. If you need backend later, reintroduce Laravel or a Node API.
 - You can remove remaining PHP-specific files if any are left-over.

## Supabase Setup

**This project now uses Supabase as the backend database instead of localStorage.**

### Quick Setup
1. Create a project at https://supabase.com
2. Run the database schema from `database/schema.sql` in Supabase SQL Editor
3. Create storage buckets: `avatars` and `memories`
4. Add your credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart dev server: `npm run dev`

### Detailed Instructions
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete setup guide including:
- Database schema installation
- Storage bucket configuration
- RLS policies
- Troubleshooting tips

### Features Using Supabase
- **Authentication**: Sign up, login, protected routes
- **Profiles**: User profiles with MBTI, zodiac, favorite drinks
- **Badges & Stickers**: Social features between users
- **Memory Reel**: Photo/video uploads with captions
- **Favorites**: BFF system to bookmark favorite classmates
- **Settings**: Persistent BGM and volume preferences

All data previously stored in localStorage is now persisted to Supabase.
