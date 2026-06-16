import React, { useState } from 'react';

export default function OnboardingView({ userName, onComplete }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: `¡Hola ${userName}!`,
      content: <>Bienvenido a 'Camino al Examen - Clase B'. Soy Kuromi, y seré tu instructora personal para ayudarte a sacar tu licencia de conducir a la primera. <span style={{fontSize: '1.8rem', verticalAlign: 'middle'}}>🚗💨</span></>,
      image: "kuromi_celebrate_1781483026283.png"
    },
    {
      title: "¿De qué trata esto?",
      content: <>El juego consta de muchos niveles. En cada nivel tendrás que superar un test de 10 preguntas reales del Libro del Nuevo Conductor. ¡Aprenderás jugando!</>,
      image: "kuromi_instructor_1781483016419.png"
    },
    {
      title: "El Sistema de Vidas",
      content: <>Tienes 5 vidas (<img src='/images/kuro_heart.png' alt='Vida' style={{width:'28px', height:'28px', verticalAlign:'middle', mixBlendMode:'multiply'}}/>). Si repruebas un test, pierdes una vida. Las vidas se recargan automáticamente cada 15 minutos, pero si no quieres esperar, ¡puedes estudiar en la Sala de Castigo para recuperarlas al instante!</>,
      image: "kuromi_sad_1781483036083.png"
    },
    {
      title: "¡Tú puedes hacerlo!",
      content: <>Aprobar el examen teórico puede parecer difícil, pero con constancia y estudiando un poquito todos los días, ¡esa licencia será tuya muy pronto! ¿Estás listo para empezar la aventura?</>,
      image: "kuromi_celebrate_1781483026283.png"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentSlide = slides[step];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100dvh', 
      backgroundColor: 'var(--kuro-bg)',
      padding: '20px',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '30px 20px',
        border: '3px solid var(--kuro-purple)',
        boxShadow: '0 8px 0 var(--kuro-purple)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <img 
          src={`/images/${currentSlide.image}`} 
          alt="Kuromi" 
          style={{ height: '160px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginBottom: '20px' }} 
        />
        
        <h2 style={{ color: 'var(--kuro-dark)', marginBottom: '15px' }}>
          {currentSlide.title}
        </h2>
        
        <p style={{ color: 'var(--kuro-dark)', fontSize: '1.1rem', lineHeight: '1.5', minHeight: '100px' }}>
          {currentSlide.content}
        </p>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          {slides.map((_, i) => (
            <div 
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: i === step ? 'var(--kuro-pink)' : '#e5e5e5',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>

        <button 
          className="duo-btn btn-blue" 
          onClick={handleNext}
          style={{ width: '100%' }}
        >
          {step === slides.length - 1 ? "¡Empezar a Jugar!" : "Siguiente"}
        </button>

      </div>

    </div>
  );
}
