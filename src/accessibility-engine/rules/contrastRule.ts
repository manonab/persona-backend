export function checkContrast(domData) {
  const issues = [];

  domData.elements.forEach(el => {
    const fg = el.styles.color;
    const bg = el.styles.backgroundColor;

    const contrast = calculateContrast(fg, bg);
    if (contrast < 4.5) {
      issues.push({
        rule: '1.4.3',
        description: 'Contraste insuffisant',
        severity: 'Modéré',
        recommendation: 'Augmenter le contraste des couleurs.'
      });
    }
  });

  return issues;
}

function calculateContrast(fg: string, bg: string) {
  const getLuminance = (color: string) => {
    if (!color) return 1; // ✅ Retourne une luminance maximale par défaut si la couleur est undefined

    const rgbMatch = color.match(/\d+/g);
    if (!rgbMatch) return 1; // ✅ Gestion des cas où le format de la couleur est incorrect

    const rgb = rgbMatch.map(Number);

    // Si la couleur n'a pas les 3 composantes RGB, on retourne une valeur par défaut
    if (rgb.length < 3) return 1;

    const [r, g, b] = rgb.map((c) =>
      c / 255 <= 0.03928 ? c / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);

  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}
