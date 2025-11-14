import {
  FaBookOpen,
  FaCalendarAlt,
  FaCertificate,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaGlobeAmericas,
  FaUserTie
} from 'react-icons/fa';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';

export default function CursosProfesionales() {
  // Colores definidos como variables
  const colors = {
    primary: '#029e99',        // Viridian Green
    secondary: '#181d38',      // Yankees Blue
    accent: '#0af89b',         // Bright Green
    lightAccent: '#59d2ec',    // Sky Blue
    dark: '#161616',           // Chinese Black
    light: '#fbfaf7',          // Snow
    gold: '#ffd700'            // Gold for certificates
  };
  
  // Datos reutilizables
  const features = [
    { icon: <FaGlobeAmericas size={30} />, title: 'Inglés británico y americano', color: colors.lightAccent },
    { icon: <FaUserTie size={30} />, title: 'Profesores certificados', color: colors.accent },
    { icon: <FaChalkboardTeacher size={30} />, title: 'Habla inglés desde la primera clase', color: colors.primary },
    { icon: <FaCertificate size={30} />, title: 'Certificados internacionales', color: colors.gold },
    { icon: <FaBookOpen size={30} />, title: 'Material didáctico moderno', color: colors.lightAccent },
    { icon: <FaCheckCircle size={30} />, title: 'Práctica con nativos extranjeros', color: colors.accent },
    { icon: <FaCheckCircle size={30} />, title: 'Actividades multimedia interactivas', color: colors.primary },
    { icon: <FaCheckCircle size={30} />, title: 'Clases 100% personalizadas', color: colors.gold },
  ];

  const flexibilityItems = [
    { icon: <FaClock />, title: 'Sesiones de 50 minutos' },
    { icon: <FaCalendarAlt />, title: 'Elige tu fecha de inicio' },
    { icon: <FaClock />, title: 'Programa tus sesiones por día/semana' },
    { icon: <FaCalendarAlt />, title: 'Clases cualquier día de la semana' },
  ];

  const targetAudience = [
    'Mayores de 22 años que necesitan ser bilingües rápidamente',
    'Profesionales que valoran su tiempo y prefieren horarios flexibles',
    'Personas que buscan resultados sin métodos tradicionales aburridos'
  ];

  return (
    <>
    <Navbar/> 
      <main style={{ backgroundColor: colors.light, paddingTop: '76px' }}>
        {/* Hero Section */}
        <section 
          className="hero-section py-5 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
            padding: '6rem 0 4rem',
          }}
          aria-labelledby="hero-heading"
        >
          <div className="container">
            <h1 id="hero-heading" className="display-4 fw-bold mb-4">Inglés Acelerado para Profesionistas</h1>
            <p className="lead fs-3 mb-4">Domina el inglés en menos de 3 meses con nuestro método exclusivo</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="target-section py-5" 
          style={{ backgroundColor: colors.light }}
          aria-labelledby="target-heading"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h2 id="target-heading" className="fw-bold mb-4" style={{ color: colors.primary }}>
                  Dirigido a <span style={{ color: colors.secondary }}>profesionistas como tú</span>
                </h2>
                <ul className="list-unstyled fs-5">
                  {targetAudience.map((item, index) => (
                    <li 
                      key={index} 
                      className="mb-3 d-flex align-items-start"
                      style={{
                        transition: 'all 0.3s ease',
                        padding: '0.75rem',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(10, 248, 155, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaCheckCircle 
                        className="me-3 mt-1" 
                        style={{ color: colors.accent }} 
                        aria-hidden="true"
                      />
                      <span style={{ color: colors.dark }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Profesionales en una reunión aprendiendo inglés"
                  className="img-fluid rounded-4 shadow"
                  style={{
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section py-5" 
          style={{ backgroundColor: colors.light }}
          aria-labelledby="features-heading"
        >
          <div className="container">
            <h2 id="features-heading" className="text-center fw-bold mb-5 display-5" style={{ color: colors.secondary }}>
              Nuestro <span style={{ color: colors.primary }}>Método Exclusivo</span>
            </h2>
            
            <div className="row g-4">
              {features.map((feature, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div 
                    className="feature-card p-4 h-100 rounded-4 text-center"
                    style={{
                      backgroundColor: 'white',
                      borderTop: `4px solid ${feature.color}`,
                      transition: 'all 0.3s ease',
                      color: colors.dark,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                    tabIndex="0"
                  >
                    <div className="mb-3" style={{ color: feature.color }} aria-hidden="true">
                      {feature.icon}
                    </div>
                    <h3 className="h5 fw-bold">{feature.title}</h3>
                    <p className="mt-3 small text-muted">
                      {index % 2 === 0 ? 'Método innovador que acelera el aprendizaje' : 'Técnicas probadas científicamente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flexibility Section */}
        <section className="flexibility-section py-5" 
          style={{ backgroundColor: colors.light }}
          aria-labelledby="flexibility-heading"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 order-md-2">
                <h2 id="flexibility-heading" className="fw-bold mb-4 display-5" style={{ color: colors.secondary }}>
                  Adaptamos el curso a <span style={{ color: colors.primary }}>tu ritmo de vida</span>
                </h2>
                <div className="row g-4">
                  {flexibilityItems.map((item, index) => (
                    <div key={index} className="col-md-6">
                      <div 
                        className="d-flex align-items-center p-3 rounded-3 h-100"
                        style={{ 
                          backgroundColor: 'white',
                          border: `1px solid ${colors.primary}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                          e.currentTarget.style.borderColor = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                          e.currentTarget.style.borderColor = colors.primary;
                        }}
                      >
                        <div className="me-3" style={{ color: colors.accent, fontSize: '1.5rem' }} aria-hidden="true">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="h5 mb-0 fw-bold" style={{ color: colors.dark }}>{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6 order-md-1">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Persona revisando su agenda para organizar su tiempo"
                  className="img-fluid rounded-4 shadow"
                  style={{
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}