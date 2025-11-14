import { Link } from 'react-router-dom';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';

export default function Home() {
  // Datos de ejemplo de testimonios de alumnos
  const testimonials = [
    {
      id: 1,
      name: "María González",
      course: "Desarrollo Web Full Stack",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      comment: "Gracias a Express Learning conseguí mi primer trabajo como desarrolladora en solo 3 meses. Las clases prácticas fueron clave!",
      rating: 5,
      country: "México",
      language: "Español"
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      course: "Data Science Avanzado",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      comment: "Los profesores son expertos en la industria y el material está siempre actualizado. Recomiendo 100% esta plataforma.",
      rating: 5,
      country: "Colombia",
      language: "Español"
    },
    {
      id: 3,
      name: "Ana Torres",
      course: "Diseño UX/UI",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      comment: "El método de aprendizaje interactivo hizo que retuviera mucho mejor los conceptos. Ahora trabajo freelance para clientes internacionales.",
      rating: 4,
      country: "España",
      language: "Español"
    }
  ];

  // Función para scroll suave
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar/>

      {/* Hero Section - Mejorada */}
      <header
        className="d-flex align-items-center justify-content-center text-center position-relative"
        style={{
          backgroundColor: '#181d38',
          minHeight: '100vh',
          color: '#fbfaf7',
          padding: '2rem',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}
      >
        {/* Efectos de fondo mejorados */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(89, 210, 236, 0.2) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(10, 248, 155, 0.15) 0%, transparent 50%)',
            zIndex: 0
          }}
        ></div>
        
        <div className="container position-relative" style={{ zIndex: 1 }}>
          {/* Título Principal - Mejorado */}
          <h1 
            className="display-2 fw-bold mb-4"
            style={{ 
              color: '#59d2ec',
              textShadow: '0 4px 8px rgba(0,0,0,0.4)',
              lineHeight: '1.2',
              background: 'linear-gradient(135deg, #59d2ec, #0af89b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Transforma tu aprendizaje con<br />
            <span style={{ 
              display: 'inline-block',
              marginTop: '0.5rem',
              fontSize: '1.2em'
            }}>Express Learning Online</span>
          </h1>
          
          {/* Texto descriptivo - Mejorado */}
          <div className="mx-auto" style={{ maxWidth: '700px' }}>
            <p 
              className="lead fs-4 mb-5"
              style={{ 
                color: 'rgba(251, 250, 247, 0.95)',
                lineHeight: '1.6',
                fontWeight: 300,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Domina nuevas habilidades con nuestro método interactivo,
              seguimiento personalizado y docentes altamente capacitados.
            </p>
          </div>
          
          {/* Botones - Mejorados */}
          <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
            <Link 
              to="/courses" 
              className="btn btn-lg px-5 py-3 fw-bold d-flex align-items-center"
              style={{ 
                backgroundColor: '#0af89b', 
                color: '#161616',
                borderRadius: '50px',
                minWidth: '220px',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 6px 20px rgba(10, 248, 155, 0.4)',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(10, 248, 155, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 248, 155, 0.4)';
              }}
            >
              <i className="bi bi-book me-3 fs-5"></i>
              Explorar cursos
            </Link>
            
            <button
              onClick={() => scrollToSection('experiencias')}
              className="btn btn-lg px-5 py-3 fw-bold d-flex align-items-center"
              style={{ 
                backgroundColor: 'transparent', 
                color: '#fbfaf7',
                border: '2px solid rgba(251, 250, 247, 0.4)',
                borderRadius: '50px',
                minWidth: '220px',
                transition: 'all 0.3s ease',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(251, 250, 247, 0.15)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(251, 250, 247, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(251, 250, 247, 0.4)';
              }}
            >
              <i className="bi bi-people-fill me-3 fs-5"></i>
              Ver experiencias
            </button>
          </div>

          {/* Flecha indicadora de scroll */}
          <div className="mt-5 pt-5">
            <div 
              className="mx-auto"
              style={{
                width: '30px',
                height: '50px',
                border: '2px solid rgba(251, 250, 247, 0.5)',
                borderRadius: '25px',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  width: '4px',
                  height: '12px',
                  backgroundColor: '#59d2ec',
                  borderRadius: '2px',
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animation: 'scroll 2s infinite'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Animación de scroll */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(-50%) translateY(0); opacity: 1; }
              100% { transform: translateX(-50%) translateY(20px); opacity: 0; }
            }
          `}
        </style>
      </header>

      {/* Features Section - Mejorada */}
      <section 
        className="py-5 position-relative" 
        style={{ 
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          paddingTop: '6rem',
          paddingBottom: '6rem'
        }}
      >
        {/* Elemento decorativo */}
        <div 
          style={{
            position: 'absolute',
            top: '-100px',
            left: '0',
            width: '100%',
            height: '100px',
            background: 'linear-gradient(to bottom, transparent 0%, #f8fafc 100%)'
          }}
        ></div>
        
        <div className="container text-center position-relative">
          <h2 
            className="display-4 fw-bold mb-5"
            style={{ 
              color: '#0f766e',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            Nuestras ventajas
            <span 
              style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
                borderRadius: '2px'
              }}
            ></span>
          </h2>
          
          <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            Descubre por qué miles de estudiantes eligen nuestra plataforma para su desarrollo profesional
          </p>
          
          <div className="row g-4 mt-4">
            {[
              {
                icon: 'bi-person-video3',
                title: 'Clases interactivas',
                description: 'Sesiones en vivo y grabadas con herramientas colaborativas para un aprendizaje activo y participativo.',
                color: '#0d9488'
              },
              {
                icon: 'bi-clipboard-data',
                title: 'Seguimiento inteligente',
                description: 'Dashboard personalizado con análisis de tu progreso, puntos fuertes y áreas de mejora.',
                color: '#059669'
              },
              {
                icon: 'bi-people-fill',
                title: 'Expertos certificados',
                description: 'Profesionales con amplia experiencia pedagógica y dominio en sus áreas de conocimiento.',
                color: '#0ea5e9'
              }
            ].map((feature, index) => (
              <div key={index} className="col-md-4">
                <div 
                  className="p-4 h-100 rounded-4"
                  style={{
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div 
                    className="icon-wrapper mb-4 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: `${feature.color}15`,
                      fontSize: '2.2rem',
                      color: feature.color,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className={feature.icon}></i>
                  </div>
                  <h4 className="fw-bold mb-3" style={{color: '#1e293b'}}>{feature.title}</h4>
                  <p className="mb-0" style={{color: '#64748b', lineHeight: '1.6'}}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mejorada */}
      <section 
        id="experiencias"
        className="py-5" 
        style={{ 
          backgroundColor: '#ffffff',
          color: '#1e293b',
          position: 'relative'
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3" style={{ color: '#1e40af' }}>
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Experiencias reales de estudiantes que transformaron sus carreras con nosotros
            </p>
            <div style={{ 
              height: '4px', 
              width: '80px', 
              background: 'linear-gradient(to right, #3b82f6, #10b981)', 
              margin: '20px auto',
              borderRadius: '2px'
            }}></div>
          </div>
          
          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-lg-4 col-md-6">
                <div 
                  className="p-4 h-100 rounded-4"
                  style={{
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  {/* Quote icon */}
                  <i className="bi bi-chat-quote-fill" style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '2rem',
                    color: 'rgba(59, 130, 246, 0.1)',
                    zIndex: 0
                  }}></i>
                  
                  <div className="d-flex align-items-center mb-4" style={{ position: 'relative', zIndex: 1 }}>
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        border: '3px solid #e2e8f0'
                      }}
                    />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#1e40af' }}>{testimonial.name}</h5>
                      <small className="text-muted d-block">{testimonial.country}</small>
                      <small className="text-primary fw-semibold">{testimonial.course}</small>
                    </div>
                  </div>
                  
                  <p className="mb-4 position-relative" style={{ 
                    color: '#475569',
                    lineHeight: '1.6',
                    zIndex: 1,
                    fontSize: '0.95rem'
                  }}>
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="text-warning mb-3" style={{ zIndex: 1, position: 'relative' }}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <i key={i} className="bi bi-star-fill fs-6 me-1"></i>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA al final de testimonios */}
          <div className="text-center mt-5 pt-3">
            <Link 
              to="/courses" 
              className="btn btn-primary btn-lg px-5 py-3 fw-bold"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              Comienza tu journey ahora
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}