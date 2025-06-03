# Quick Supabase Storage Setup for Avatar Uploads

## ⚡ Quick Setup Steps

### 1. Create Storage Bucket
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `mpplpmjlhgbijzaexcqe`
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Set bucket name: `avatars`
6. Make it **public** ✅
7. Click **"Create bucket"**

### 2. Set Storage Policies
Navigate to **Storage** → **Policies** and create these policies:

#### Policy 1: Upload for authenticated users
- **Policy name**: `Allow authenticated upload`
- **Operation**: `INSERT`
- **Target roles**: `authenticated`
- **Expression**: 
```sql
(auth.role() = 'authenticated')
```

#### Policy 2: Public read access
- **Policy name**: `Public read access`
- **Operation**: `SELECT` 
- **Target roles**: `public`
- **Expression**:
```sql
true
```

#### Policy 3: Delete own files
- **Policy name**: `Delete own avatars`
- **Operation**: `DELETE`
- **Target roles**: `authenticated`
- **Expression**:
```sql
(auth.role() = 'authenticated')
```

### 3. Test Upload
1. Refresh your application: http://localhost:8091/
2. Login with any test account (e.g., `admin@horizonbankss.com` / `HorizonSecure2024!`)
3. Go to **Profile** page
4. Click on your avatar → Upload an image
5. ✅ Should work without CSP errors now!

## 🔧 Changes Made to Fix CSP Error

1. **Updated CSP in `index.html`**:
   - Added `connect-src 'self' https://mpplpmjlhgbijzaexcqe.supabase.co`
   - This allows fetch requests to your Supabase project

2. **Fixed file path structure**:
   - Removed duplicate `avatars/` in file path
   - Files now stored as: `avatars/userId-timestamp.ext`
   - Instead of: `avatars/avatars/userId-timestamp.ext`

## 🚀 Ready to Test!

The avatar upload feature should now work properly. You can:
- Drag & drop images
- Click to select files  
- See upload progress
- Remove existing avatars
- Get toast notifications

## 🛠 Troubleshooting

If uploads still fail:
1. Check browser console for errors
2. Verify Supabase bucket exists and is public
3. Ensure storage policies are active
4. Check network tab for failed requests
5. Verify you're logged in to the application

---
**Next**: Try uploading an avatar in your Profile page! 