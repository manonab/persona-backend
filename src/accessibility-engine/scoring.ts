export function calculateScore(issues, persona) {
  let accessibilityScore = 100;
  let uxScore = 100;

  issues.forEach((issue) => {
    let penalty = 0;

    switch (issue.severity) {
      case 'Critique':
        penalty = 10;
        break;
      case 'Modéré':
        penalty = 5;
        break;
      case 'Faible':
        penalty = 2;
        break;
    }

    if (persona.constraints?.vision === 'low' && issue.rule === '1.4.3') {
      penalty *= 1.5;
    }

    if (
      persona.constraints?.inputMethod === 'keyboard_only' &&
      issue.rule === '2.1.1'
    ) {
      penalty *= 1.5;
    }

    accessibilityScore -= penalty;
    uxScore -= penalty / 2;
  });

  return {
    accessibilityScore: Math.max(10, accessibilityScore),
    uxScore: Math.max(10, uxScore),
  };
}
