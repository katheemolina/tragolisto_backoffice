import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [captchaValue, setCaptchaValue] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Credenciales hardcodeadas (en producción esto debería venir de una API)
  const VALID_CREDENTIALS = {
    username: 'Kat!41',
    password: '41!Kat'
  };

  // Generar captcha al cargar el componente
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
    setUserCaptchaInput('');
    setIsCaptchaValid(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setUserCaptchaInput(value);
    setIsCaptchaValid(value.toLowerCase() === captchaValue.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.username.trim()) {
      toast.error('Por favor ingresa el usuario');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('Por favor ingresa la contraseña');
      return;
    }

    if (!userCaptchaInput.trim()) {
      toast.error('Por favor completa el captcha');
      return;
    }

    if (!isCaptchaValid) {
      toast.error('El captcha es incorrecto');
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validar credenciales
      if (formData.username === VALID_CREDENTIALS.username && 
          formData.password === VALID_CREDENTIALS.password) {
        
        // Guardar estado de autenticación
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', formData.username);
        localStorage.setItem('loginTime', new Date().toISOString());

        console.log('Login successful, auth data saved:', {
          isAuthenticated: localStorage.getItem('isAuthenticated'),
          user: localStorage.getItem('user'),
          loginTime: localStorage.getItem('loginTime')
        });

        toast.success('¡Bienvenido al sistema!');
        // Recargar la página para que ProtectedRoute detecte la autenticación
        window.location.href = '/';
      } else {
        toast.error('Usuario o contraseña incorrectos');
        setFormData({ username: '', password: '' });
        generateCaptcha();
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Tragolisto Backoffice</h1>
          <p>Inicia sesión para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa tu usuario"
              className="form-control"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa tu contraseña"
                className="form-control"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="captcha">Verificación de Seguridad</label>
            <div className="captcha-container">
              <div className="captcha-display">
                <span className="captcha-text">{captchaValue}</span>
                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={generateCaptcha}
                  title="Generar nuevo captcha"
                >
                  🔄
                </button>
              </div>
              <input
                type="text"
                id="captcha"
                value={userCaptchaInput}
                onChange={handleCaptchaChange}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa el código de arriba"
                className={`form-control ${userCaptchaInput && !isCaptchaValid ? 'error' : ''}`}
                required
              />
              {userCaptchaInput && (
                <div className={`captcha-status ${isCaptchaValid ? 'valid' : 'invalid'}`}>
                  {isCaptchaValid ? '✅ Correcto' : '❌ Incorrecto'}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !isCaptchaValid}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-note">
            🔒 Este sistema está protegido con autenticación de múltiples factores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 