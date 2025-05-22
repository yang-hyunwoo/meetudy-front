"use client";

import { ImageIcon, X } from "lucide-react";

interface ThumbnailUploaderProps {
  thumbnail: File | null;
  thumbnailPreview: string | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
}

export default function ThumbnailUploader({
  thumbnail,
  thumbnailPreview,
  onChange,
  onRemove,
}: ThumbnailUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    e.target.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        썸네일 이미지
      </label>
      <div className="flex items-center gap-4">
        <label className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
          <span className="text-sm">파일 선택</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {thumbnail && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{thumbnail.name}</span>
            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
      {thumbnailPreview && (
        <img
          src={thumbnailPreview}
          alt="썸네일 미리보기"
          className="mt-4 max-h-64 object-contain rounded-lg border"
        />
      )}
    </div>
  );
}
