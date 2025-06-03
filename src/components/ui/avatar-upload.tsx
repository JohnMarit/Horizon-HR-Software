import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uploadAvatar, validateImageFile, getAvatarPath, deleteAvatar, type UploadResult } from '@/lib/utils';
import { 
  CameraIcon, 
  UploadIcon, 
  XIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  TrashIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string;
  userId: string;
  userName: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userId,
  userName,
  onAvatarUpdate,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setValidationError('');
    setUploadProgress(0);
    setDragOver(false);
  };

  const handleFileSelect = (file: File) => {
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file');
      return;
    }

    setValidationError('');
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Delete old avatar if it exists and it's not a placeholder
      if (currentAvatar && !currentAvatar.includes('placeholder')) {
        const oldAvatarPath = getAvatarPath(currentAvatar);
        if (oldAvatarPath) {
          await deleteAvatar(oldAvatarPath);
        }
      }

      // Upload new avatar
      const result: UploadResult = await uploadAvatar(selectedFile, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        onAvatarUpdate(result.url);
        toast.success('Profile picture updated successfully!');
        setIsOpen(false);
        resetState();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture. Please try again.');
      setValidationError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar || currentAvatar.includes('placeholder')) return;
    
    try {
      const avatarPath = getAvatarPath(currentAvatar);
      if (avatarPath) {
        const success = await deleteAvatar(avatarPath);
        if (success) {
          onAvatarUpdate('/placeholder-avatar.png');
          toast.success('Profile picture removed successfully!');
        } else {
          toast.error('Failed to remove profile picture');
        }
      }
    } catch (error) {
      console.error('Remove avatar error:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const openDialog = () => {
    setIsOpen(true);
    resetState();
  };

  const closeDialog = () => {
    setIsOpen(false);
    resetState();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      {/* Avatar with upload button overlay */}
      <div className={`relative group ${className}`}>
        <Avatar className="h-24 w-24 cursor-pointer" onClick={openDialog}>
          <AvatarImage src={currentAvatar} />
          <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          onClick={openDialog}
        >
          <CameraIcon className="h-6 w-6 text-white" />
        </div>
        
        {/* Edit button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border-2 border-white shadow-lg"
          onClick={openDialog}
        >
          <CameraIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture or remove the current one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current/Preview Avatar */}
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl || currentAvatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-4xl">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Area */}
            {!selectedFile && (
              <Card
                className={`border-2 border-dashed transition-colors cursor-pointer ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-6 text-center">
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Selected File Info */}
            {selectedFile && !isUploading && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetState}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircleIcon className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {validationError}
                </AlertDescription>
              </Alert>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          <DialogFooter className="flex gap-2">
            {/* Remove Avatar Button */}
            {currentAvatar && !currentAvatar.includes('placeholder') && !selectedFile && (
              <Button
                variant="outline"
                onClick={handleRemoveAvatar}
                className="flex-1"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}

            {/* Cancel Button */}
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isUploading}
              className="flex-1"
            >
              Cancel
            </Button>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 