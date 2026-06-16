// Placeholders temporales para avatares (SVG data URIs con fondo transparente)

const createSvgDataUri = (svgString) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// 1. Personajes (Characters) - Emojis grandes centrados
export const CHARACTERS = [
  { id: 'char_1', name: 'Original', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">😈</text></svg>`) },
  { id: 'char_2', name: 'Gato', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">🐱</text></svg>`) },
  { id: 'char_3', name: 'Zorro', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">🦊</text></svg>`) },
  { id: 'char_4', name: 'Conejo', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">🐰</text></svg>`) },
  { id: 'char_5', name: 'Panda', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">🐼</text></svg>`) },
  { id: 'char_6', name: 'Robot', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="60">🤖</text></svg>`) },
];

// 2. Fondos (Backgrounds) - Círculos sólidos o gradientes que se ubicarán detrás
export const BACKGROUNDS = [
  { id: 'bg_1', name: 'Rosa Pastel', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#f8bbd0"/></svg>`) },
  { id: 'bg_2', name: 'Celeste', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#b3e5fc"/></svg>`) },
  { id: 'bg_3', name: 'Menta', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#b2dfdb"/></svg>`) },
  { id: 'bg_4', name: 'Lavanda', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#e1bee7"/></svg>`) },
  { id: 'bg_5', name: 'Amarillo', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#fff9c4"/></svg>`) },
  { id: 'bg_6', name: 'Gris Oscuro', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#424242"/></svg>`) },
];

// 3. Bordes de Escudo (Borders) - Marcos con el centro totalmente transparente
const shieldPath = "M50,5 L90,20 L90,50 C90,75 50,95 50,95 C50,95 10,75 10,50 L10,20 Z";

export const BORDERS = [
  { id: 'border_1', name: 'Acero', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#9e9e9e" stroke-width="6" stroke-linejoin="round"/></svg>`) },
  { id: 'border_2', name: 'Oro', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#ffca28" stroke-width="6" stroke-linejoin="round"/></svg>`) },
  { id: 'border_3', name: 'Platino', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#e0e0e0" stroke-width="6" stroke-linejoin="round"/></svg>`) },
  { id: 'border_4', name: 'Kuro Dark', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#212121" stroke-width="6" stroke-linejoin="round"/></svg>`) },
  { id: 'border_5', name: 'Kuro Pink', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#e91e63" stroke-width="6" stroke-linejoin="round"/></svg>`) },
  { id: 'border_6', name: 'Neón', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#00e676" stroke-width="6" stroke-linejoin="round" filter="drop-shadow(0 0 5px #00e676)"/></svg>`) },
];

// Helper para encontrar item por ID
export const getAvatarItem = (collection, id) => collection.find(i => i.id === id) || collection[0];
