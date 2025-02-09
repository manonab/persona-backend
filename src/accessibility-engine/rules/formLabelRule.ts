export function checkFormLabels(domData) {
  return domData.elements
    .filter(el =>
      (el.tag === 'INPUT' || el.tag === 'SELECT' || el.tag === 'TEXTAREA') &&
      !el.hasLabel
    )
    .map(el => ({
      rule: '3.3.2',
      description: 'Champ de formulaire sans label',
      severity: 'Critique',
      recommendation: 'Ajoutez un label associé à ce champ de formulaire pour améliorer l’accessibilité.'
    }));
}