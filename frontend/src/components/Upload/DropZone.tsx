import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }
    const name = file.name.toLowerCase();
    if (!name.endsWith('.log') && !name.endsWith('.txt')) {
      alert('Only .log and .txt files are supported.');
      return;
    }
    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300' : 
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".log,.txt"
        disabled={disabled}
      />
      <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
      <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
        {selectedFileName ? (
          <span className="font-semibold text-gray-900">{selectedFileName}</span>
        ) : (
          <>
            <span className="font-semibold text-blue-600 hover:text-blue-500">
              Click to choose a file
            </span>
            <span>or drag and drop it here</span>
          </>
        )}
      </div>
      <p className="text-xs leading-5 text-gray-400 mt-2">
        Supports .log and .txt (Max 20MB)
      </p>
    </div>
  );
};
