# Avatar Upload Feature

## Overview
The avatar upload feature allows users to upload, update, and remove their profile pictures in the Horizon Bank HR Management System.

## Features

### ✅ **Upload Profile Pictures**
- Drag and drop support
- Click to select files
- Real-time preview
- Progress indicator during upload
- File validation (type, size)
- Automatic old avatar cleanup

### ✅ **File Validation**
- **Supported formats**: JPEG, JPG, PNG, WebP
- **Maximum file size**: 5MB
- **Automatic validation**: Real-time error messages for invalid files

### ✅ **User Experience**
- **Hover effects**: Camera icon overlay on hover
- **Easy access**: Camera button in bottom-right corner of avatar
- **Preview**: Live preview before uploading
- **Progress tracking**: Upload progress with percentage
- **Toast notifications**: Success/error feedback

### ✅ **Security & Storage**
- Files stored in Supabase Storage
- Unique filename generation with user ID and timestamp
- Automatic cleanup of old avatars when new ones are uploaded
- Public URL generation for displaying images

## Components

### 1. `AvatarUpload` Component
**Location**: `src/components/ui/avatar-upload.tsx`

**Props**:
- `currentAvatar`: Current avatar URL
- `userId`: User's unique identifier
- `userName`: User's display name for fallback
- `onAvatarUpdate`: Callback function when avatar is updated
- `className`: Optional CSS classes

**Features**:
- Drag and drop file upload
- File validation
- Preview functionality
- Upload progress tracking
- Remove avatar functionality

### 2. Utility Functions
**Location**: `src/lib/utils.ts`

**Functions**:
- `validateImageFile(file: File)`: Validates image files
- `uploadAvatar(file: File, userId: string)`: Uploads avatar to Supabase
- `deleteAvatar(filePath: string)`: Removes old avatars
- `getAvatarPath(url: string)`: Extracts file path from URL

### 3. AuthContext Integration
**Location**: `src/contexts/AuthContext.tsx`

**New Method**:
- `updateAvatar(newAvatarUrl: string)`: Updates user avatar in context and localStorage

## Implementation

### Usage in Profile Page
```tsx
import { AvatarUpload } from "@/components/ui/avatar-upload";

<AvatarUpload
  currentAvatar={employeeProfile.avatar}
  userId={user.id}
  userName={employeeProfile.name}
  onAvatarUpdate={updateAvatar}
/>
```

### File Upload Flow
1. User selects/drops image file
2. File validation (type, size)
3. Preview generation
4. User confirms upload
5. Old avatar deletion (if exists)
6. New file upload to Supabase
7. Public URL generation
8. Avatar update in context
9. UI refresh with new avatar

## Storage Structure

### Supabase Storage Bucket: `avatars`
```
avatars/
├── {userId}-{timestamp}.jpg
├── {userId}-{timestamp}.png
└── {userId}-{timestamp}.webp
```

### File Naming Convention
- Format: `{userId}-{timestamp}.{extension}`
- Example: `user123-1703980800000.jpg`
- Ensures unique filenames and prevents conflicts

## Error Handling

### File Validation Errors
- **Invalid file type**: "Please select a valid image file (JPEG, PNG, or WebP)"
- **File too large**: "Image size must be less than 5MB"

### Upload Errors
- **Network issues**: "Failed to upload image. Please try again."
- **Unexpected errors**: "An unexpected error occurred while uploading."

### User Feedback
- **Success**: Toast notification with "Profile picture updated successfully!"
- **Errors**: Toast notifications with specific error messages
- **Remove**: "Profile picture removed successfully!"

## Browser Compatibility
- **Modern browsers**: Full support with drag & drop
- **Older browsers**: Fallback to click-to-select
- **Mobile devices**: Touch-friendly interface
- **File API**: Required for file validation and preview

## Security Considerations

### File Validation
- Client-side validation for immediate feedback
- File type checking based on MIME type
- File size restrictions to prevent large uploads

### Storage Security
- Files stored in Supabase with proper access controls
- Unique filename generation prevents conflicts
- Old files automatically cleaned up

### Authentication
- Only authenticated users can upload avatars
- User can only update their own avatar
- Avatar updates are logged in AuthContext

## Testing

### Manual Testing Checklist
- [ ] Upload valid image files (JPEG, PNG, WebP)
- [ ] Test file size validation (over 5MB)
- [ ] Test invalid file types
- [ ] Test drag and drop functionality
- [ ] Test click to select functionality
- [ ] Verify preview functionality
- [ ] Test upload progress indicator
- [ ] Test avatar removal
- [ ] Verify toast notifications
- [ ] Test on mobile devices
- [ ] Verify avatar updates throughout the app

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Future Enhancements

### Potential Improvements
1. **Image Cropping**: Allow users to crop images before upload
2. **Multiple Sizes**: Generate thumbnails for different use cases
3. **Bulk Upload**: Admin functionality to upload multiple avatars
4. **Integration**: Sync with external systems (Active Directory, etc.)
5. **Analytics**: Track avatar upload usage and success rates

### Performance Optimizations
1. **Image Compression**: Automatic compression before upload
2. **Lazy Loading**: Lazy load avatars in lists
3. **Caching**: Better caching strategies for uploaded images
4. **CDN**: Use CDN for faster image delivery

## Troubleshooting

### Common Issues

**Upload Fails**
- Check internet connection
- Verify file size (< 5MB)
- Ensure valid file format
- Check Supabase storage configuration

**Avatar Not Updating**
- Hard refresh browser (Ctrl+F5)
- Check browser cache
- Verify localStorage is not full
- Check console for JavaScript errors

**Drag & Drop Not Working**
- Ensure modern browser support
- Check for JavaScript errors
- Verify file API support
- Test with click-to-select fallback

## Dependencies

### Required Packages
- `@supabase/supabase-js`: Supabase client for file storage
- `sonner`: Toast notifications
- `lucide-react`: Icons
- `tailwindcss`: Styling

### Browser APIs
- File API: For file handling and validation
- Drag & Drop API: For drag and drop functionality
- URL.createObjectURL: For file preview generation

## Configuration

### Environment Variables
Make sure your Supabase configuration is properly set up in:
- `src/integrations/supabase/client.ts`

### Storage Bucket Setup
Ensure the `avatars` bucket exists in your Supabase project with proper permissions for authenticated users. 