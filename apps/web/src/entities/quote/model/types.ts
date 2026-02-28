export interface Quote {
  id: number;
  text: string;
  source: string;
  keywords: string[];
  category: 'movie' | 'drama';
}
