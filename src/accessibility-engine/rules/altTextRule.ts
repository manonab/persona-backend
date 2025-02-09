export function checkAltText(domData) {
  return domData.images
    .filter(img => !img.alt)
    .map(img => ({
      rule: '1.1.1',
      description: 'Image sans texte alternatif',
      severity: 'Critique',
      recommendation: 'Ajoutez un attribut alt descriptif à l’image.'
    }));
}
