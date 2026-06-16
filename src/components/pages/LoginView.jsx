import React, { useState } from 'react';
import { loginWithGoogle, loginAnonymously, loginWithEmail, registerWithEmail, linkGoogleAccount, linkEmailAccount } from '../../services/auth';

export default function LoginView({ onLoginSuccess, isLinking = false, onCancel, onGuestLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = isLinking ? await linkGoogleAccount() : await loginWithGoogle();
      onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/credential-already-in-use') {
        setError('Esa cuenta de Google ya está vinculada a otro perfil.');
      } else {
        setError('Error al conectar con Google.');
      }
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (onGuestLogin) {
        onGuestLogin();
      } else {
        const user = await loginAnonymously();
        onLoginSuccess(user);
      }
    } catch (err) {
      setError('Error al iniciar como invitado.');
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) {
      setError('Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let user;
      if (isLinking) {
        user = await linkEmailAccount(email, password, isRegistering ? name : null);
      } else if (isRegistering) {
        user = await registerWithEmail(email, password, name);
      } else {
        user = await loginWithEmail(email, password);
      }
      onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use' || err.code === 'auth/credential-already-in-use') {
        setError('Ese correo ya está en uso por otra cuenta.');
      } else {
        setError(isRegistering ? 'Error al registrar. Revisa tus datos.' : 'Credenciales incorrectas o usuario no encontrado.');
      }
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid var(--kuro-pink)',
    width: '100%',
    marginBottom: '10px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const btnStyle = {
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    width: '100%',
    marginBottom: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100dvh', 
      backgroundColor: 'var(--kuro-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <img src="/images/kuromi_instructor_1781483016419.png" style={{ height: '120px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginBottom: '20px', animation: 'float 3s infinite' }} alt="Kuromi" />
      <h1 style={{ color: 'var(--kuro-dark)', marginBottom: '20px', textAlign: 'center' }}>
        {isLinking ? 'Protege tu Progreso' : 'Kuro Driving Test'}
      </h1>
      {isLinking && <p style={{textAlign: 'center', marginBottom: '20px', color: 'var(--kuro-dark)'}}>Vincula una cuenta para guardar tu progreso en la nube y acceder desde cualquier dispositivo.</p>}
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '20px', 
        boxShadow: '0 8px 0 var(--kuro-gray)',
        width: '100%', 
        maxWidth: '350px' 
      }}>
        {error && <p style={{ color: 'var(--kuro-incorrect)', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {isRegistering && (
            <input 
              type="text" 
              placeholder="Tu Apodo" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={inputStyle}
            />
          )}
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={inputStyle}
          />
          <input 
            type="password" 
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={{ ...btnStyle, backgroundColor: 'var(--kuro-dark)' }}>
            {loading ? 'Cargando...' : (isLinking ? 'Vincular Correo' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'))}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '5px 0' }}>
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} 
            <span 
              onClick={() => { setIsRegistering(!isRegistering); setError(null); }} 
              style={{ color: 'var(--kuro-pink)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}>
              {isRegistering ? 'Inicia aquí' : 'Regístrate aquí'}
            </span>
          </p>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--kuro-gray)' }}></div>
          <span style={{ margin: '0 10px', color: 'var(--kuro-gray-shadow)' }}>o</span>
          <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--kuro-gray)' }}></div>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} style={{ ...btnStyle, backgroundColor: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: 'white', borderRadius: '50%', padding: '2px', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
          </span>
          {isLinking ? 'Vincular con Google' : 'Continuar con Google'}
        </button>

        {!isLinking && (
          <button onClick={handleGuestLogin} disabled={loading} style={{ ...btnStyle, backgroundColor: 'var(--kuro-gray)', color: 'var(--kuro-dark)', marginTop: '10px' }}>
            Jugar como Invitado
          </button>
        )}

        {isLinking && (
          <button onClick={onCancel} disabled={loading} style={{ ...btnStyle, backgroundColor: 'transparent', color: 'var(--kuro-dark)', marginTop: '10px', textDecoration: 'underline' }}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
