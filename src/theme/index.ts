const palette = {
  purple: '#7B61FF',
  purpleDark: '#5e43f3',
  black: '#0A0A0A',
  darkGray: '#1C1C1E',
  lightGray: '#2C2C2E',
  white: '#FFFFFF',
  offWhite: '#F2F2F7',
  green: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  blue: '#007AFF',
};

export const theme = {
  colors: {
    background: palette.black,
    card: palette.darkGray,
    text: palette.white,
    textSecondary: '#8E8E93',
    primary: palette.purple,
    secondary: palette.green,  // Protein/Good
    accent: palette.orange,    // Carbs/Warning
    danger: palette.red,
    border: palette.lightGray,
    tint: palette.purple,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    round: 100,
  },
  typography: {
    header: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: palette.white,
      fontFamily: 'System', // Use system font for now
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: palette.white,
      fontFamily: 'System',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#A1A1A1', // Slightly dimmer for body
      fontFamily: 'System',
    },
  },
};
