export type KemetButtonVariant = 
  | 'gold-primary' 
  | 'turquoise-primary' 
  | 'gold-secondary' 
  | 'tertiary';

export type KemetButtonSize = 'sm' | 'md' | 'lg';

export interface KemetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KemetButtonVariant;
  size?: KemetButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isFullWidth?: boolean;
  goldShine?: boolean;
}

export interface HieroglyphSign {
  id: string;
  glyph: string;
  transliteration: string;
  meaning: string;
  gardinerCode: string;
  category: 'uniliteral' | 'biliteral' | 'royal' | 'deity' | 'symbol';
  audioNote?: string;
}

export interface RoyalCartoucheConfig {
  royalName: string;
  transliteratedGlyphs: string[];
  epithet: string;
  theme: 'gold-foil' | 'lapis-inlay' | 'turquoise-gem' | 'papyrus-ink';
  orientation: 'vertical' | 'horizontal';
}

export interface ArtifactItem {
  id: string;
  accessionNumber: string;
  title: string;
  arabicTitle: string;
  period: string;
  dynasty: string;
  date: string;
  medium: string;
  dimensions: string;
  provenance: string;
  description: string;
  arabicDescription: string;
  keyHieroglyphs: string[];
  dominantMaterial: 'gold' | 'lapis' | 'sandstone' | 'papyrus';
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabicQuestion: string;
  glyphPrompt?: string;
  options: { label: string; arabicLabel: string; isCorrect: boolean }[];
  explanation: string;
  arabicExplanation: string;
}
