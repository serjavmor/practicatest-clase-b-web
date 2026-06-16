// Placeholders temporales para avatares (SVG data URIs con fondo transparente)

const createSvgDataUri = (svgString) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// 1. Personajes (Characters) - Ilustraciones PNG
export const CHARACTERS = [
  { id: 'char_1', name: 'Kuro Bunny', src: '/images/avatars/char_rabbit.png' },
  { id: 'char_2', name: 'Pinky Cat', src: '/images/avatars/char_cat.png' },
  { id: 'char_3', name: 'Bad Penguin', src: '/images/avatars/char_penguin.png' },
  { id: 'char_4', name: 'Fluffy Dog', src: '/images/avatars/char_dog.png' },
  { id: 'char_5', name: 'Goth Bat', src: '/images/avatars/char_bat.png' },
  { id: 'char_6', name: 'Retro Bot', src: '/images/avatars/char_robot.png' },
];

// Forma central del escudo
const shieldPath = "M50,5 L90,20 L90,50 C90,75 50,95 50,95 C50,95 10,75 10,50 L10,20 Z";

// 2. Fondos (Backgrounds) - Círculos sólidos o gradientes que se ubicarán detrás
export const BACKGROUNDS = [
  { id: 'bg_1', name: 'Rosa Pastel', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#f8bbd0"/></svg>`) },
  { id: 'bg_2', name: 'Celeste', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#b3e5fc"/></svg>`) },
  { id: 'bg_3', name: 'Menta', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#b2dfdb"/></svg>`) },
  { id: 'bg_4', name: 'Lavanda', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#e1bee7"/></svg>`) },
  { id: 'bg_5', name: 'Amarillo', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#fff9c4"/></svg>`) },
  { id: 'bg_6', name: 'Gris Oscuro', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="#424242"/></svg>`) },
];

// 3. Bordes de Escudo (Borders) - Marcos con el centro totalmente transparente
export const BORDERS = [
  { id: 'border_1', name: 'Acero', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#eeeeee"/><stop offset="50%" stop-color="#9e9e9e"/><stop offset="100%" stop-color="#424242"/></linearGradient></defs><path d="${shieldPath}" fill="none" stroke="url(#grad1)" stroke-width="8" stroke-linejoin="round"/></svg>`) },
  { id: 'border_2', name: 'Oro', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff176"/><stop offset="50%" stop-color="#ffca28"/><stop offset="100%" stop-color="#f57f17"/></linearGradient></defs><path d="${shieldPath}" fill="none" stroke="url(#grad2)" stroke-width="8" stroke-linejoin="round"/></svg>`) },
  { id: 'border_3', name: 'Platino', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#b3e5fc"/><stop offset="100%" stop-color="#0288d1"/></linearGradient></defs><path d="${shieldPath}" fill="none" stroke="url(#grad3)" stroke-width="8" stroke-linejoin="round"/></svg>`) },
  { id: 'border_4', name: 'Kuro Dark', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#424242"/><stop offset="100%" stop-color="#000000"/></linearGradient></defs><path d="${shieldPath}" fill="none" stroke="url(#grad4)" stroke-width="8" stroke-linejoin="round"/><path d="${shieldPath}" fill="none" stroke="#e1bee7" stroke-width="2" stroke-linejoin="round"/></svg>`) },
  { id: 'border_5', name: 'Kuro Pink', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f48fb1"/><stop offset="100%" stop-color="#c2185b"/></linearGradient></defs><path d="${shieldPath}" fill="none" stroke="url(#grad5)" stroke-width="8" stroke-linejoin="round"/><path d="${shieldPath}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/></svg>`) },
  { id: 'border_6', name: 'Neón', src: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${shieldPath}" fill="none" stroke="#00e676" stroke-width="8" stroke-linejoin="round" filter="drop-shadow(0 0 5px #00e676)"/></svg>`) },
];

// Helper para encontrar item por ID
export const getAvatarItem = (collection, id) => collection.find(i => i.id === id) || collection[0];
