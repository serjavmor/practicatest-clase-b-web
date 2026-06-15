const fs = require('fs');
const path = require('path');

const signs = {
  // Q7: Intermitentes de peligro (Triángulo rojo)
  '7': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#222" rx="10"/><polygon points="50,15 90,85 10,85" fill="#f00"/><polygon points="50,28 80,80 20,80" fill="#222"/><path d="M50 40 L50 65 M50 75 L50 77" stroke="#f00" stroke-width="6" stroke-linecap="round"/></svg>`,
  
  // Q205: Zona Escuela
  '205': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><path d="M40,30 a5,5 0 1,1 10,0 a5,5 0 1,1 -10,0 M30,40 h20 v30 M50,40 h20 v20 M60,35 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>`,

  // Q245: Velocidad Máxima
  '245': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#fff" stroke="#f00" stroke-width="12"/><text x="50" y="65" font-family="Arial" font-weight="bold" font-size="40" text-anchor="middle" fill="#000">60</text></svg>`,

  // Q247: Pavimento Resbaladizo
  '247': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><path d="M35,65 Q45,45 55,65 T75,65 M25,75 Q35,55 45,75 T65,75" fill="none" stroke="#000" stroke-width="3"/><rect x="40" y="30" width="20" height="15" rx="2" fill="#000"/></svg>`,

  // Q248: No Adelantar
  '248': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#fff" stroke="#f00" stroke-width="12"/><rect x="30" y="40" width="15" height="20" rx="2" fill="#000"/><rect x="55" y="40" width="15" height="20" rx="2" fill="#f00"/><line x1="20" y1="80" x2="80" y2="20" stroke="#f00" stroke-width="8"/></svg>`,

  // Q251: Proximidad Semáforo
  '251': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><rect x="40" y="20" width="20" height="60" rx="2" fill="#000"/><circle cx="50" cy="30" r="6" fill="#f00"/><circle cx="50" cy="50" r="6" fill="#ff0"/><circle cx="50" cy="70" r="6" fill="#0f0"/></svg>`,

  // Q255: Dos Sentidos
  '255': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><path d="M40,80 L40,20 L30,30 M40,20 L50,30 M60,20 L60,80 L50,70 M60,80 L70,70" fill="none" stroke="#000" stroke-width="6" stroke-linejoin="miter" stroke-linecap="square"/></svg>`,

  // Q256: Cruce Peatones
  '256': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><path d="M25,80 h50 M35,70 h30 M45,60 h10 M50,20 a6,6 0 1,1 0,12 a6,6 0 1,1 0,-12 M50,35 v25 M40,60 l10,-20 M60,60 l-10,-20 M35,45 l15,-5 M65,45 l-15,-5" fill="none" stroke="#000" stroke-width="4"/></svg>`,

  // Q258: Ciclistas
  '258': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#ffcc00" stroke="#000" stroke-width="3"/><circle cx="35" cy="65" r="10" fill="none" stroke="#000" stroke-width="3"/><circle cx="65" cy="65" r="10" fill="none" stroke="#000" stroke-width="3"/><path d="M35,65 l15,-15 h15 M50,50 l-5,-15 h10 M45,35 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0" fill="none" stroke="#000" stroke-width="3"/></svg>`
};

const outputDir = path.join(__dirname, 'public', 'images', 'signs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Escribir SVGs
for (const [id, svg] of Object.entries(signs)) {
  fs.writeFileSync(path.join(outputDir, `sign_${id}.svg`), svg);
}

// 2. Parchear questions.json
const questionsPath = path.join(__dirname, 'public', 'data', 'questions.json');
const rawData = fs.readFileSync(questionsPath, 'utf8');
const questions = JSON.parse(rawData);

let updated = 0;
questions.forEach(q => {
  if (signs[q.id.toString()]) {
    q.local_image = `signs/sign_${q.id}.svg`;
    updated++;
  }
});

fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`Updated ${updated} questions with sign images.`);
