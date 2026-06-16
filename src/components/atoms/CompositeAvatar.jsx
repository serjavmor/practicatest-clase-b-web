import React from 'react';
import { BACKGROUNDS, CHARACTERS, BORDERS, getAvatarItem } from '../../constants/avatars';

export default function CompositeAvatar({ config, size = 100 }) {
  // Configuración por defecto por si no existe
  const avatarConfig = config || {
    backgroundId: BACKGROUNDS[0].id,
    characterId: CHARACTERS[0].id,
    borderId: BORDERS[0].id,
  };

  const bg = getAvatarItem(BACKGROUNDS, avatarConfig.backgroundId);
  const char = getAvatarItem(CHARACTERS, avatarConfig.characterId);
  const border = getAvatarItem(BORDERS, avatarConfig.borderId);

  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      display: 'inline-block',
      overflow: 'visible' // Para que las sombras del escudo (neon) se vean
    }}>
      {/* Capa 1: Fondo */}
      <img 
        src={bg.src} 
        alt="Background" 
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 1
        }} 
      />
      
      {/* Capa 2: Personaje */}
      <img 
        src={char.src} 
        alt="Character" 
        style={{
          position: 'absolute',
          top: '25%', left: '25%',
          width: '50%', height: '50%',
          objectFit: 'contain',
          zIndex: 2
        }} 
      />
      
      {/* Capa 3: Borde de Escudo */}
      <img 
        src={border.src} 
        alt="Border" 
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 3,
          pointerEvents: 'none' // Para que no interfiera con clics
        }} 
      />
    </div>
  );
}
