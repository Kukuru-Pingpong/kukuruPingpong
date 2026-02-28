import type { Quote } from '../model/types';
import quotes from '../data/quotes';

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
