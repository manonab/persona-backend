import { crawlPage } from './crawler';
import { applyRules } from './rules';
import { calculateScore } from './scoring';

export async function analyzeAccessibility(url: string, persona: any) {
  const domData = await crawlPage(url);
  const issues = applyRules(domData);
  const { accessibilityScore, uxScore } = calculateScore(issues, persona);

  const uniqueIssues = issues.filter((issue, index, self) =>
      index === self.findIndex((i) =>
        i.rule === issue.rule &&
        i.description === issue.description &&
        i.recommendation === issue.recommendation
      )
  );

  return {
    accessibilityScore: accessibilityScore,
    uxScore: uxScore,
    issues: uniqueIssues,
    recommendations: [...new Set(uniqueIssues.map(issue => issue.recommendation))]
  };
}
