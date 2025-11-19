import React, { useRef } from 'react';
import { Camera, Upload, Shirt } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <GlassCard className="text-center hover:bg-white/10 transition-all duration-300 cursor-pointer border-dashed border-2 border-white/20 group">
        <div 
          onClick={triggerUpload}
          className="flex flex-col items-center justify-center py-12 space-y-6"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/20 to-emerald-200/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="bg-white/10 p-6 rounded-full relative z-10">
              <Shirt className="w-12 h-12 text-stone-200" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-stone-800 p-2 rounded-full border border-white/10">
                <Camera className="w-4 h-4 text-stone-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-stone-100 tracking-wide">Scan Your Piece</h3>
            <p className="text-stone-400 text-sm font-light">
              Tap to take a photo or upload from gallery
            </p>
          </div>
          
          <button className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 text-sm font-medium transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Select Image</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};