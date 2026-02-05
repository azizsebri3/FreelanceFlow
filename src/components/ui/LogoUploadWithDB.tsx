/* ==========================================================================
   Logo Upload with Database Persistence
   Component for uploading and managing logos with server-side storage
   ========================================================================== */

import React, { useState, useRef } from 'react';

interface LogoUploadProps {
  logoUrl?: string;
  onLogoChange: (logoUrl: string | undefined) => void;
  onLogoUpload?: (file: File) => Promise<string>; // Optional upload function
}

export default function LogoUpload({
  logoUrl,
  onLogoChange,
  onLogoUpload
}: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let finalLogoUrl: string;

      if (onLogoUpload) {
        // Use custom upload function (server-side)
        finalLogoUrl = await onLogoUpload(file);
      } else {
        // Fallback to Base64 (client-side only)
        finalLogoUrl = await convertToBase64(file);
      }

      onLogoChange(finalLogoUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = () => {
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Company Logo (Optional)
      </label>

      <div className="flex items-center gap-4">
        {/* Logo Preview */}
        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : logoUrl ? 'Change Logo' : 'Upload Logo'}
          </button>

          {logoUrl && (
            <button
              type="button"
              onClick={removeLogo}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white"
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Upload a PNG, JPG, or GIF file (max 2MB). The logo will appear on your invoice PDFs.
      </p>
    </div>
  );
}