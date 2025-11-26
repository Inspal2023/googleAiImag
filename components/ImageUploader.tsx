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
    <div className="relative group">
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
            relative flex justify-center items-center w-full h-72 px-6 
            border-3 border-dashed rounded-3xl cursor-pointer transition-all duration-300
            overflow-hidden
            ${isDragging 
                ? 'border-indigo-400 bg-indigo-50 scale-[1.01] shadow-xl' 
                : 'border-slate-300 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-lg'
            }
        `}
      >
        <input id={id} name={id} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
        
        {sourceImageUrl ? (
          <>
            <img src={sourceImageUrl} alt="Preview" className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-sm" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-3xl backdrop-blur-sm">
                <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full border border-white/20">更换图片</span>
            </div>
          </>
        ) : (
          <div className="space-y-3 text-center relative z-10">
            <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-500' : 'bg-white text-slate-400 shadow-sm'}`}>
                <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              <span className="text-indigo-500 hover:text-indigo-600">点击上传</span> 或 拖拽文件
            </div>
            <p className="text-xs text-slate-400">支持 PNG, JPG, GIF</p>
          </div>
        )}
      </label>
    </div>
  );
};