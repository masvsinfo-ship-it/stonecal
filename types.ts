
export enum CalculatorTab {
  VOLUME = 'VOLUME',
  MURUBBA_TO_PIECE = 'MURUBBA_TO_PIECE',
  METER_TO_PIECE = 'METER_TO_PIECE',
  PIECE_TO_ALL = 'PIECE_TO_ALL',
  HISTORY = 'HISTORY',
  GEMINI_AI = 'GEMINI_AI'
}

export enum Language {
  BN = 'bn',
  HI = 'hi',
  AR = 'ar',
  EN = 'en'
}

export interface CalculationResult {
  volume?: number;
  area?: number;
  murubba?: number;
  pieces?: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  tabType: CalculatorTab;
  inputs: Record<string, string>;
  results: Record<string, any>;
}
