# Frontend-Only Setup

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
1. Create a project at https://supabase.com and copy your Project URL and anon public key.
2. Add them to `.env` (create if missing) using:
	```env
	VITE_SUPABASE_URL=your_project_url
	VITE_SUPABASE_ANON_KEY=your_anon_key
	```
3. Use the client from `resources/js/lib/supabase.ts`:
	```ts
	import { supabase } from '@/lib/supabase';
	const { data, error } = await supabase.from('profiles').select('*');
	```
4. For auth, use `supabase.auth.signUp`, `signInWithPassword`, `signOut` and protect routes via React Router.
