import React from 'react';

export default function TheoryView({ lesson, onComplete }) {
  if (!lesson) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>No hay lección para este nivel.</h2>
        <button className="duo-btn btn-blue" onClick={onComplete} style={{ width: '80%' }}>
          Comenzar Test
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>{lesson.title}</h1>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '16px',
        fontSize: '1.2rem',
        marginBottom: '20px'
      }}>
        {lesson.content}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '20px' }}>
        <img src="/images/kuromi_instructor_1781483016419.png" alt="Kuromi Instructora" style={{ height: '120px' }} />
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          marginLeft: '10px',
          fontWeight: 'bold',
          position: 'relative',
          bottom: '20px'
        }}>
          ¡Lee esto antes de seguir!
        </div>
      </div>

      <button className="duo-btn btn-blue" onClick={onComplete}>
        ¡Estoy listo!
      </button>
    </div>
  )
}
