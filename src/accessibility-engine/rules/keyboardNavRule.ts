export function checkKeyboardNavigation(domData) {
  const focusableElements = domData.elements.filter(el => {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    const tabindex = el.styles.tabIndex;
    return focusableTags.includes(el.tag) || (tabindex !== undefined && tabindex >= 0);
  });

  const issues = [];

  // Vérifier s’il y a des éléments interactifs sans focus visible
  focusableElements.forEach(el => {
    if (el.styles.outlineStyle === 'none' || el.styles.outlineWidth === '0px') {
      issues.push({
        rule: '2.1.1',
        description: 'Manque d’indicateur visuel de focus pour la navigation clavier',
        severity: 'Modéré',
        recommendation: 'Ajoutez un style de focus visible (par exemple un contour ou un changement de couleur) pour les éléments interactifs.'
      });
    }
  });

  return issues;
}
