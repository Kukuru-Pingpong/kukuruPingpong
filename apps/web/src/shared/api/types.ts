export interface Judgment {
  // Per-category scores (0-100 each)
  player1_tone: number;
  player1_emotion: number;
  player1_rhythm: number;
  player1_pronunciation: number;
  player2_tone: number;
  player2_emotion: number;
  player2_rhythm: number;
  player2_pronunciation: number;
  // Weighted totals: tone*0.4 + emotion*0.3 + rhythm*0.2 + pronunciation*0.1
  player1_total: number;
  player2_total: number;
  // Legacy fields (keep for compatibility)
  player1_score: number;
  player2_score: number;
  winner: number;
  reason: string;
  player1_feedback: string;
  player2_feedback: string;
}
