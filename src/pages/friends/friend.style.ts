// src/styles/theme.ts
export const colors = {
  background: '#242424',
  surface: '#2C2C2E', // Nền cho card, input
  primaryText: '#FFFFFF',
  secondaryText: '#AEAEB2',
  tertiaryText: '#8E8E93',
  accent: '#0A84FF', // Một màu nhấn (ví dụ)
  messengerBlue: '#0078FF',
  zaloBlue: '#0068FF',
  instagramWhite: '#fff',
  iconDefault: '#555555',
  // ... thêm các màu khác
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as 'bold', // Cần ép kiểu cho fontWeight
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as '600',
  },
  body: {
    fontSize: 17,
  },
  caption: {
    fontSize: 13,
  },
  // ...
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
  // ...
};