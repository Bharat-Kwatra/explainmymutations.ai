export enum ExplanationMode {
  PATIENT = 'PATIENT',
  CLINICIAN = 'CLINICIAN',
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
  // Other potential grounding chunk types can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields can be added here
}
