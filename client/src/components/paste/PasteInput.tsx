import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Trash2, UploadCloud, ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface PasteInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onImageChange: (base64: string | null) => void;
  imagePreview: string | null;
}

export function PasteInput({ value, onChange, onClear, onImageChange, imagePreview }: PasteInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    } else {
      const text = e.dataTransfer.getData('text');
      if (text) {
        onChange(value ? `${value}\n${text}` : text);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Paste text or drop an image</h3>
        <Button variant="ghost" size="sm" onClick={() => { onClear(); onImageChange(null); }} disabled={!value && !imagePreview}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragging ? 'border-accent bg-[#eff6ff]' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full text here, or drag & drop an image/poster..."
          className="min-h-[200px] w-full resize-y bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        
        {imagePreview ? (
          <div className="mt-4 w-full">
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-48 rounded border shadow-sm" />
              <button
                onClick={() => onImageChange(null)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 border-t pt-4 text-gray-500">
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-xs">Drag and drop an image containing opportunity details</p>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Browse Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </div>

      <p className="mt-2 text-right font-mono text-xs text-gray-500">{value.length} characters</p>
    </div>
  );
}
