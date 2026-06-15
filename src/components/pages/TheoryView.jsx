import React, { useState } from 'react';
import './TheoryView.css';

export default function TheoryView({ lesson, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!lesson || !lesson.slides || lesson.slides.length === 0) {
    return (
      <div className="theory-container" style={{ justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>No hay lección para este nivel.</h2>
        <button className="duo-btn btn-blue" onClick={onComplete} style={{ width: '80%' }}>
          Comenzar Test
        </button>
      </div>
    );
  }

  const slides = lesson.slides;
  const isLastSlide = currentSlide === slides.length - 1;

  const nextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="theory-container">
      {/* Header */}
      <h1 className="theory-title">{lesson.title}</h1>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
      <p className="progress-text">
        Píldora {currentSlide + 1} de {slides.length}
      </p>

      {/* Kuromi Chat Bubble */}
      <div className="kuromi-chat-container">
        <img 
          src="/images/kuromi_instructor_1781483016419.png" 
          alt="Kuromi Instructora" 
          className="kuromi-avatar"
        />
        <div className="chat-bubble">
          ¡Hola! Lee con atención estas diapositivas antes de tu examen.
        </div>
      </div>

      {/* Carousel Card */}
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="carousel-slide" key={index}>
              <div className={`slide-card ${index === slides.length - 1 ? 'final-slide' : ''}`}>
                <h2 className="slide-title">
                  {index === slides.length - 1 ? <img src="/images/kuro_coin.png" style={{width: '24px', verticalAlign: 'middle', mixBlendMode: 'multiply'}}/> : <img src="/images/kuro_book.png" style={{width: '24px', verticalAlign: 'middle', mixBlendMode: 'multiply'}}/>} {slide.title}
                </h2>
                <p className="slide-content">{slide.content}</p>
                {index === slides.length - 1 && (
                  <div className="success-icon"><img src="/images/kuro_sparkle.png" style={{width: '40px', mixBlendMode: 'multiply'}}/></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="carousel-controls">
        <button 
          className="duo-btn btn-gray-outline" 
          onClick={prevSlide}
          style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}
        >
          Atrás
        </button>

        {!isLastSlide ? (
          <button className="duo-btn btn-blue" onClick={nextSlide}>
            Siguiente
          </button>
        ) : (
          <button className="duo-btn btn-green" onClick={onComplete}>
            ¡Comenzar Test!
          </button>
        )}
      </div>
    </div>
  );
}
