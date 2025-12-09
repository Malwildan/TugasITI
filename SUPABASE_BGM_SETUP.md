# Supabase Storage Setup for Background Music (BGM)

To enable the custom background music upload feature, you need to create a storage bucket in your Supabase project.

## Step 1: Create the Bucket

1.  Go to your **Supabase Dashboard**.
2.  Click on **Storage** in the left sidebar.
3.  Click **New Bucket**.
4.  Name the bucket: `bgm` (must be exact).
5.  Toggle **Public bucket** to `ON`.
6.  Click **Save**.

## Step 2: Set Storage Policies

You need to allow authenticated users to upload files and everyone to read them.

1.  In the Storage page, click on the **Configuration** tab (or "Policies" depending on your version).
2.  Find the `bgm` bucket row and click **New Policy**.
3.  Choose **"For full customization"**.

### Policy 1: Allow Uploads (Insert)
*   **Name**: `Allow authenticated uploads`
*   **Allowed operations**: `INSERT`
*   **Target roles**: `authenticated`
*   **WITH CHECK expression**: `bucket_id = 'bgm'`
*   Click **Review** and **Save**.

### Policy 2: Allow Public Read (Select)
*   **Name**: `Allow public read access`
*   **Allowed operations**: `SELECT`
*   **Target roles**: `anon` and `authenticated` (or just leave default)
*   **USING expression**: `bucket_id = 'bgm'`
*   Click **Review** and **Save**.

## Troubleshooting

If you still see "Bucket not found":
1.  Double-check the bucket name is exactly `bgm` (lowercase).
2.  Ensure the bucket is set to **Public**.
3.  Refresh your application page.
