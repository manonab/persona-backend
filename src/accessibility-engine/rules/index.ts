import { checkContrast } from './contrastRule';
import { checkAltText } from './altTextRule';
import { checkFormLabels } from './formLabelRule';
import { checkKeyboardNavigation } from './keyboardNavRule';

export function applyRules(domData) {
  return [
    ...checkContrast(domData),
    ...checkAltText(domData),
    ...checkFormLabels(domData),
    ...checkKeyboardNavigation(domData)
  ];
}
