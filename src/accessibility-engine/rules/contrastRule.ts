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
    const rgb = color.match(/\d+/g)?.map(Number) || [255, 255, 255];
    return 0.2126 * (rgb[0] / 255) + 0.7152 * (rgb[1] / 255) + 0.0722 * (rgb[2] / 255);
  };
  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}
