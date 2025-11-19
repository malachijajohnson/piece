import React from 'react';
import { ExternalLink, ShoppingBag, ArrowLeft, RefreshCw, Search } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SearchResult, GroundingChunk } from '../types';

interface ResultsViewProps {
  imagePreview: string;
  result: SearchResult | null;
  loading: boolean;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ imagePreview, result, loading, onReset }) => {
  
  // Helper to parse grounding chunks into unique links
  const renderShoppingLinks = (chunks: GroundingChunk[]) => {
    const validLinks = chunks.filter(c => c.web?.uri && c.web?.title);
    
    // Deduplicate based on URI
    const uniqueLinks = Array.from(new Map(validLinks.map(item => [item.web!.uri, item])).values());

    if (uniqueLinks.length === 0) {
      return (
        <div className="p-4 text-stone-400 text-sm italic text-center">
          No direct shopping links found via search grounding. Try checking the description for brands.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 mt-4">
        {uniqueLinks.map((chunk, idx) => (
          <a 
            key={idx} 
            href={chunk.web?.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-white/10 border border-white/5 transition-all duration-300"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-stone-800/50 p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-emerald-200/80" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-stone-200 truncate pr-4 group-hover:text-white transition-colors">
                  {chunk.web?.title}
                </span>
                <span className="text-xs text-stone-500 truncate">
                  {new URL(chunk.web?.uri || '').hostname.replace('www.', '')}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-500 group-hover:text-emerald-200 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-mono text-stone-500 uppercase tracking-widest">Analysis Result</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Column */}
        <div className="flex flex-col gap-4">
          <GlassCard className="p-2 overflow-hidden relative group">
            <img 
              src={imagePreview} 
              alt="Scanned Item" 
              className="w-full h-auto rounded-xl object-cover max-h-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
                Scanned Item
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Results Column */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <GlassCard className="flex flex-col items-center justify-center min-h-[300px] space-y-4 animate-pulse">
              <RefreshCw className="w-8 h-8 text-stone-400 animate-spin" />
              <p className="text-stone-300 font-light">Scanning global markets...</p>
            </GlassCard>
          ) : result ? (
            <>
              {/* Description Card */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-emerald-200" />
                  <h2 className="text-lg font-semibold text-stone-100">Identification</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-stone-300 leading-relaxed whitespace-pre-wrap">
                  {result.description}
                </div>
              </GlassCard>

              {/* Shopping Links Card */}
              <GlassCard>
                <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">Found Online</h3>
                {renderShoppingLinks(result.groundingChunks)}
              </GlassCard>
            </>
          ) : (
            <GlassCard>
               <p className="text-red-400">Unable to load results.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};