'use client';

/* ==========================================================================
   Logo Upload Component
   Component for uploading and managing logos in invoices
   ========================================================================== */

import React, { useState, useRef } from 'react';

interface LogoUploadProps {
  logoUrl?: string;
  onLogoChange: (logoUrl: string | undefined) => void;
}

export default function LogoUpload({ logoUrl, onLogoChange }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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

    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onLogoChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      await processFile(file);
    }
  };

  const removeLogo = () => {
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <label className="text-sm font-semibold text-gray-800">
          Company Logo
        </label>
        <span className="text-xs text-gray-500">(Optional)</span>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : logoUrl
            ? 'border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5'
            : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Preview */}
          {logoUrl ? (
            <div className="relative group">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <img
                  src={logoUrl}
                  alt="Company logo"
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLogo();
                  }}
                  className="text-white text-xs hover:scale-110 transition-transform"
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className={`w-10 h-10 ${isDragOver ? 'text-primary' : 'text-gray-400'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          )}

          {/* Upload Text */}
          <div className="text-center space-y-1">
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-primary">Uploading...</span>
              </div>
            ) : logoUrl ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Logo uploaded successfully!</p>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Click to change logo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {isDragOver ? 'Drop your logo here' : 'Upload your company logo'}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, or GIF (max 2MB) • Drag & drop or click to browse
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hover overlay for existing logo */}
        {logoUrl && !isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center space-y-2">
              <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium text-white">Click to change logo</p>
            </div>
          </div>
        )}
      </div>

      {/* Remove button for existing logo */}
      {logoUrl && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={removeLogo}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove logo
          </button>
        </div>
      )}
    </div>
  );
}