import { crawlPage } from './crawler';
import { applyRules } from './rules';
import { calculateScore } from './scoring';

export async function analyzeAccessibility(url: string, persona: any) {
  const domData = await crawlPage(url);
  const issues = applyRules(domData);
  const { accessibilityScore, uxScore } = calculateScore(issues, persona);

  return {
    accessibilityScore: accessibilityScore,
    uxScore: uxScore,
    issues,
    recommendations: [...new Set(issues.map(issue => issue.recommendation))]
  };
}
