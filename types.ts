
export enum ToolType {
  DESIGN = 'DESIGN',
  IMAGE_GEN = 'IMAGE_GEN',
  CONTENT = 'CONTENT',
  PLANNER = 'PLANNER'
}

export interface PostState {
  image: string | null;
  caption: string;
  hashtags: string[];
  aspectRatio: '1:1' | '4:5' | '9:16';
  location: string;
  isGenerating: boolean;
}

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  suggestions: string[];
}
