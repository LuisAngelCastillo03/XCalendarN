import { Link, NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBookOpen, 
  FaUsers, 
  FaEnvelope, 
  FaSignInAlt,
  FaGraduationCap,
  FaTimes,
  FaBars
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import logo from '../../assets/Degradado.png';

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Definición de colores
  const colors = {
    skyBlue: '#87CEEB',
    viridianGreen: '#029e99',
    chineseBlack: '#101010',
    yankeesBlue: '#1C2841',
    snow: '#FFF9F9'
  };

  // Efecto para detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar el menú al hacer clic en un enlace (solo móvil)
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Rutas actualizadas para coincidir con App.js
  const navItems = [
    { path: '/', name: 'Inicio', icon: <FaHome />, id: 'home' },
    
    { path: '/contact', name: 'Contacto', icon: <FaEnvelope />, id: 'contact' }
  ];

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        backgroundColor: colors.chineseBlack,
        color: colors.snow,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '0.8rem 2rem',
        borderBottom: `1px solid ${colors.viridianGreen}`
      }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <Link 
          className="navbar-brand d-flex align-items-center" 
          to="/" 
          style={{ 
            color: colors.snow,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="Logo Express Learning"
              width="45"
              height="45"
              className="me-2"
              style={{ 
                borderRadius: '50%',
                objectFit: 'contain',
                border: `2px solid ${colors.viridianGreen}`,
                transform: hoveredItem === 'logo' ? 'rotate(10deg)' : 'rotate(0)',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent',
                padding: '2px'
              }}
            />
            <span 
              className="fw-bold fs-4" 
              style={{ 
                letterSpacing: '0.5px',
                transform: hoveredItem === 'logo' ? 'translateX(5px)' : 'translateX(0)',
                marginLeft: '10px'
              }}
            >
              Express Learning<span style={{ color: colors.skyBlue }}>Online</span>
            </span>
            {hoveredItem === 'logo' && (
              <FaGraduationCap 
                style={{
                  position: 'absolute',
                  right: -25,
                  top: -10,
                  color: colors.skyBlue,
                  fontSize: '1.5rem',
                  opacity: 0,
                  animation: 'fadeIn 0.3s forwards',
                  transform: 'rotate(15deg)'
                }}
              />
            )}
          </div>
        </Link>

        {/* Botón móvil */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            color: colors.snow,
            fontSize: '1.5rem'
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Contenido del navbar */}
        <div 
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
          style={{
            backgroundColor: isMobile && isOpen ? colors.chineseBlack : 'transparent',
            padding: isMobile && isOpen ? '1rem 0' : '0',
            position: isMobile && isOpen ? 'absolute' : 'static',
            top: '100%',
            left: '0',
            right: '0',
            zIndex: '1000',
            borderBottom: isMobile && isOpen ? `1px solid ${colors.viridianGreen}` : 'none'
          }}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item mx-1" key={item.id}>
                <NavLink 
                  to={item.path}
                  className="nav-link px-3 py-2 rounded d-flex align-items-center position-relative"
                  style={({ isActive }) => ({ 
                    color: isActive ? colors.skyBlue : colors.snow,
                    fontWeight: isActive ? '600' : '500',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    margin: isMobile ? '0.5rem 1rem' : '0'
                  })}
                  onMouseEnter={() => !isMobile && setHoveredItem(item.id)}
                  onMouseLeave={() => !isMobile && setHoveredItem(null)}
                  onClick={handleNavLinkClick}
                >
                  <span style={{
                    transition: 'all 0.3s ease',
                    transform: hoveredItem === item.id ? 'scale(1.2)' : 'scale(1)',
                    display: 'inline-block',
                    marginRight: '0.5rem',
                    color: hoveredItem === item.id ? colors.skyBlue : 'inherit'
                  }}>
                    {item.icon}
                  </span>
                  {item.name}
                  {!isMobile && hoveredItem === item.id && (
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '3px',
                        backgroundColor: colors.skyBlue,
                        borderRadius: '3px',
                        animation: 'grow 0.3s forwards'
                      }}
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Botón de Iniciar Sesión */}
          <div 
            className="d-flex ms-lg-3 gap-2"
            style={{
              padding: isMobile && isOpen ? '0 1rem 1rem' : '0'
            }}
          >
            <Link 
              to="/login" 
              className="btn btn-warning px-3 py-2 d-flex align-items-center position-relative"
              style={{
                borderRadius: '50px',
                fontWeight: '600',
                color: colors.chineseBlack,
                backgroundColor: colors.skyBlue,
                border: 'none',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                margin: isMobile ? '0 1rem' : '0',
                width: isMobile ? 'calc(100% - 2rem)' : 'auto'
              }}
              onMouseEnter={() => !isMobile && setHoveredItem('login')}
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
              onClick={handleNavLinkClick}
            >
              <span style={{
                transition: 'all 0.3s ease',
                transform: hoveredItem === 'login' ? 'translateX(5px)' : 'translateX(0)'
              }}>
                <FaSignInAlt className="me-2" />
              </span>
              Iniciar Sesión
              {!isMobile && hoveredItem === 'login' && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    transform: 'rotate(45deg)',
                    animation: 'shine 1.5s infinite'
                  }}
                />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px) rotate(15deg); }
          to { opacity: 1; transform: translateY(0) rotate(15deg); }
        }
        @keyframes grow {
          from { width: 0; opacity: 0; }
          to { width: 20px; opacity: 1; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
      `}</style>
    </nav>
  );
}