export function calculateScore(issues, persona) {
  let accessibilityScore = 100;
  let uxScore = 100;

  issues.forEach(issue => {
    if (issue.severity === 'Critique') {
      accessibilityScore -= 10;
      uxScore -= 5; // Impact sur l'UX
    }
    if (issue.severity === 'Modéré') {
      accessibilityScore -= 5;
      uxScore -= 3;
    }
    if (issue.severity === 'Faible') {
      accessibilityScore -= 2;
    }
  });

  return {
    accessibilityScore: Math.max(0, accessibilityScore),
    uxScore: Math.max(0, uxScore),
  };
}
