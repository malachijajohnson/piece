import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultsView } from './components/ResultsView';
import { GlassCard } from './components/GlassCard';
import { AnalysisState } from './types';
import { findClothingForSale } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    imagePreview: null,
    result: null,
    errorMessage: null,
  });

  const handleImageSelected = async (base64: string) => {
    setState(prev => ({ ...prev, status: 'analyzing', imagePreview: base64, errorMessage: null }));

    try {
      const result = await findClothingForSale(base64);
      setState(prev => ({ ...prev, status: 'complete', result }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      imagePreview: null,
      result: null,
      errorMessage: null,
    });
  };

  return (
    <div className="min-h-screen w-full bg-ambient-earth text-stone-200 selection:bg-emerald-500/30">
      {/* Overlay for texture/noise if desired, keeping it clean for now */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

      <main className="relative w-full min-h-screen flex flex-col items-center px-4 py-8 md:py-12">
        
        {/* Header / Brand */}
        <div className="w-full max-w-5xl mb-12 flex flex-col items-center text-center space-y-1 z-10">
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-stone-400 mb-1">
            Piece Finder
          </h1>
          
          {/* Trademark Signature */}
          <div className="text-[10px] font-medium tracking-[0.3em] text-stone-500 uppercase mb-4 opacity-80">
            mal made. &copy;
          </div>

          <p className="text-stone-400 max-w-md mx-auto text-sm md:text-base font-light">
            Find the clothes you love. Scan any item to discover where to buy it online.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-5xl z-10 transition-all duration-500">
          {state.status === 'idle' && (
             <div className="animate-fade-in-up">
                <UploadZone onImageSelected={handleImageSelected} />
                
                {/* Feature Highlights */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  {[
                    { title: "Visual Recognition", desc: "Advanced technology identifies fabric, brand style, and cut." },
                    { title: "Global Search", desc: "Scans thousands of retailers for the best match." }
                  ].map((item, i) => (
                    <GlassCard key={i} className="text-center py-8 hover:bg-white/10 transition-colors">
                      <h3 className="text-stone-200 font-semibold mb-2">{item.title}</h3>
                      <p className="text-stone-500 text-sm">{item.desc}</p>
                    </GlassCard>
                  ))}
                </div>
             </div>
          )}

          {(state.status === 'analyzing' || state.status === 'complete') && (
            <ResultsView 
              imagePreview={state.imagePreview!} 
              result={state.result} 
              loading={state.status === 'analyzing'} 
              onReset={handleReset}
            />
          )}

          {state.status === 'error' && (
             <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
                <GlassCard className="border-red-500/30 bg-red-900/10 max-w-md">
                  <h3 className="text-red-200 font-semibold mb-2">Scan Failed</h3>
                  <p className="text-stone-300 mb-4">{state.errorMessage}</p>
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm transition-colors w-full"
                  >
                    Try Again
                  </button>
                </GlassCard>
             </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-stone-600 text-xs text-center z-10">
        </footer>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;