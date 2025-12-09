# Supabase Database Setup Guide

## Prerequisites
- Supabase account (https://supabase.com)
- Project created in Supabase

## Step 1: Run the Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `database/schema.sql` from this repository
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute the schema

This will create all necessary tables:
- `profiles` - User profiles with personal info
- `user_badges` - Badge unlocks for users
- `stickers` - Stickers sent between users
- `favorites` - BFF/favorite user relationships
- `memories` - Memory Reel photos/videos
- `user_settings` - User preferences (BGM URL, volume)

## Step 2: Create Storage Buckets

1. Navigate to **Storage** in Supabase dashboard
2. Create two public buckets:
   - `avatars` - For user profile photos
   - `memories` - For memory reel media files

### Configure Storage Policies

For each bucket, add these policies:

#### Avatars Bucket
```sql
-- Allow public read access
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'avatars' );

-- Allow users to update their own avatars
create policy "Users can update their own avatars"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'avatars' );
```

#### Memories Bucket
```sql
-- Allow public read access
create policy "Memory images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'memories' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload memories"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'memories' );

-- Allow users to update their own memories
create policy "Users can update their own memories"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'memories' );

-- Allow users to delete their own memories
create policy "Users can delete their own memories"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'memories' );
```

## Step 3: Get Your Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. Open or create `.env` in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Register a new account or login
3. Navigate to different pages:
   - **Classmates** - Create your profile, view others
   - **Memory Reel** - Upload photos/videos
   - **Stat Lab** - View statistics

## Verification Checklist

- [ ] All database tables created successfully
- [ ] Storage buckets `avatars` and `memories` exist
- [ ] Storage policies configured for both buckets
- [ ] Environment variables set in `.env`
- [ ] Can register and login
- [ ] Can create user profile in Classmates
- [ ] Can upload avatar image
- [ ] Can send stickers to other users
- [ ] Can unlock badges for users
- [ ] Can add/edit/delete memories
- [ ] Can upload media to Memory Reel
- [ ] BGM settings persist across sessions
- [ ] Statistics display correctly in Stat Lab

## Troubleshooting

### "Failed to fetch profiles"
- Check your Supabase URL and anon key in `.env`
- Verify Row Level Security policies are enabled
- Check browser console for specific errors

### Storage upload fails
- Ensure storage buckets exist
- Verify storage policies are configured
- Check file size limits (default 50MB)

### RLS Policy Issues
- All tables have RLS enabled
- Public read access for viewing data
- Authenticated write access for own data
- See `database/schema.sql` for policy details

## Data Migration (Optional)

If you have existing localStorage data you want to migrate:

1. Export localStorage data from browser console:
```javascript
// Export memories
console.log(JSON.stringify(localStorage.getItem('memoryReel_memories')));

// Export classmates
console.log(JSON.stringify(localStorage.getItem('classmates')));
```

2. Contact support or manually insert via SQL Editor
3. Clear localStorage after migration:
```javascript
localStorage.clear();
```

## Next Steps

- Customize badge definitions in `supabase-data.ts`
- Add more sticker options
- Implement real-time subscriptions for live updates
- Add user search and filtering
- Enable email notifications for stickers/badges
