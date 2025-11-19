export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchResult {
  description: string;
  groundingChunks: GroundingChunk[];
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  imagePreview: string | null;
  result: SearchResult | null;
  errorMessage: string | null;
}