import type { FailureCard, Severity, Summary } from './types.js';

const severityRank: Record<Severity, number> = { info: 0, warning: 1, error: 2 };

export function summarizeCards(cards: FailureCard[]): Summary {
  const patternCounts: Record<string, number> = {};
  let highest: Severity | 'none' = 'none';
  let totalFailures = 0;

  for (const card of cards) {
    totalFailures += card.hits.length;
    patternCounts[card.patternId] = (patternCounts[card.patternId] ?? 0) + card.hits.length;
    if (highest === 'none' || severityRank[card.severity] > severityRank[highest]) highest = card.severity;
  }

  const headline = cards.length === 0
    ? 'No known CI failure patterns found.'
    : `${cards.length} failure card${cards.length === 1 ? '' : 's'} from ${totalFailures} signal${totalFailures === 1 ? '' : 's'}; first: ${cards[0]?.title}.`;

  return {
    totalCards: cards.length,
    totalFailures,
    highestSeverity: highest,
    headline,
    patternCounts,
  };
}
