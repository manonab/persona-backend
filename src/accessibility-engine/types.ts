export interface Issue {
  rule: string;
  description: string;
  severity: 'Critique' | 'Modéré' | 'Faible';
  recommendation: string;
}

export interface Persona {
  id: string;
  constraints: {
    vision?: 'low' | 'normal';
    inputMethod?: 'keyboard_only' | 'mouse' | 'touch';
  };
}
