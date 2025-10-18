import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  sourceImageUrl: string | null;
  id: string; // ID属性，用于确保组件实例的唯一性
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, sourceImageUrl, id }) => {
    const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          onImageUpload(file, e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div>
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-4 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging ? 'border-sky-500 bg-sky-100' : 'border-slate-400 hover:border-sky-400'
        }`}
      >
        <input id={id} name={id} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
        {sourceImageUrl ? (
          <img src={sourceImageUrl} alt="已上传预览，点击可更换" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <span className="relative font-medium text-sky-600 hover:text-sky-500">
                点击上传
              </span>
              <p className="pl-1">或拖拽文件</p>
            </div>
            <p className="text-xs text-slate-500">支持PNG, JPG, GIF格式，最大10MB</p>
          </div>
        )}
      </label>
    </div>
  );
};