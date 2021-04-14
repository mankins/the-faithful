import stringHash from 'string-hash';

const defaultPalette = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AACA51',
  '#6633CC',
  '#F67370',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];

// for any text, always return a consistent color
// eslint-disable-next-line import/prefer-default-export
export const colorizer = (name, palette = defaultPalette) => {
  return palette[stringHash((name || '??').toLowerCase()) % palette.length];
};
