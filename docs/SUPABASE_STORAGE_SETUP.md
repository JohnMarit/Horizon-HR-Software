# Supabase Storage Setup for Avatar Uploads

## Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `avatars`
3. Make it public for easy URL access

## Set Up Storage Policies

### Allow authenticated users to upload:
```sql
(auth.role() = 'authenticated')
```

### Allow public read access:
```sql
true
```

### Allow users to delete their own avatars:
```sql
(auth.role() = 'authenticated')
```

## Configuration
- **Bucket name**: `avatars`
- **Public**: Yes
- **File size limit**: 5MB
- **Allowed types**: image/jpeg, image/png, image/webp

## Test the setup by uploading an avatar through the application. 