// Importación de hooks de React
import { useEffect, useState } from 'react';
// Importación de iconos de FontAwesome
import { FaBook, FaBullseye, FaChalkboardTeacher, FaGlobe, FaMobileAlt } from 'react-icons/fa';
// Importación de componentes personalizados
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';

export default function About() {
  // Estado para controlar si el navbar ha hecho scroll
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // Efecto para detectar scroll y cambiar el estado del navbar
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };

    // Agregar event listener al montar el componente
    window.addEventListener('scroll', handleScroll);
    // Limpiar event listener al desmontar el componente
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page" style={{ 
      backgroundColor: '#f9f9f9', // Fondo gris claro
      minHeight: '100vh',         // Altura mínima de toda la pantalla
      paddingTop: '80px'          // Espacio para el navbar fijo
    }}>
      {/* ========== NAVBAR ========== */}
      {/* Navbar fijo en la parte superior */}
      <div className={`fixed-top ${navbarScrolled ? 'navbar-scrolled' : ''}`} style={{ zIndex: 1030 }}>
        {/* Componente Navbar con prop transparente condicional */}
        <Navbar transparent={!navbarScrolled} />
      </div>
      
      {/* ========== HERO SECTION ========== */}
      <section 
        className="hero-section text-center text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #029e99 0%, #026e6b 100%)', // Degradado verde
          padding: '8rem 0 6rem', // Espaciado vertical grande
          marginBottom: '3rem'     // Margen inferior
        }}
      >
        <div className="container position-relative" style={{ zIndex: 1 }}>
          {/* Título principal con animación */}
          <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
            ¿Quiénes somos?
          </h1>
          
          {/* Descripción con animación */}
          <p className="lead mx-auto animate__animated animate__fadeInUp" 
            style={{ 
              maxWidth: '800px',      // Ancho máximo para mejor legibilidad
              fontSize: '1.25rem',    // Tamaño de fuente aumentado
              textShadow: '0 2px 4px rgba(0,0,0,0.2)' // Sombra para mejor contraste
            }}>
            Somos una institución que ofrece cursos que se adaptan a tus necesidades y realidad en la era digital, 
            a través de clases prácticas e interactivas.
          </p>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="container mb-5">
        {/* SECCIÓN: NUESTRA PROPUESTA EDUCATIVA */}
        <section className="mb-5">
          <div className="row align-items-center">
            {/* Columna izquierda - Texto */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4" style={{ color: '#029e99' }}>Nuestra Propuesta Educativa</h2>
              
              {/* Item 1: Clases interactivas */}
              <div className="d-flex mb-3">
                <div className="me-4" style={{ color: '#029e99', fontSize: '1.5rem' }}>
                  <FaChalkboardTeacher /> {/* Icono de profesor */}
                </div>
                <div>
                  <h5 className="fw-bold">Clases en línea interactivas</h5>
                  <p>
                    Ofrecemos clases en línea que se apoyan en recursos, plataformas y aplicaciones educativas 
                    de vanguardia, tomando como referencia tu contexto familiar, social, cultural y laboral.
                  </p>
                </div>
              </div>
              
              {/* Item 2: Material incluido */}
              <div className="d-flex mb-3">
                <div className="me-4" style={{ color: '#029e99', fontSize: '1.5rem' }}>
                  <FaBook /> {/* Icono de libro */}
                </div>
                <div>
                  <h5 className="fw-bold">Material incluido</h5>
                  <p>
                    No tendrás que preocuparte por adquirir libros o cuadernos de trabajo, ya que todo lo que 
                    necesitas estará incluido en nuestro programa educativo.
                  </p>
                </div>
              </div>
              
              {/* Item 3: Resultados rápidos */}
              <div className="d-flex">
                <div className="me-4" style={{ color: '#029e99', fontSize: '1.5rem' }}>
                  <FaMobileAlt /> {/* Icono de móvil */}
                </div>
                <div>
                  <h5 className="fw-bold">Resultados rápidos</h5>
                  <p>
                    Conviértete en bilingüe en tan solo 6 meses con nuestro método acelerado y personalizado.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Imagen */}
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Estudiantes aprendiendo en línea" 
                className="img-fluid rounded shadow"
                style={{ 
                  border: '5px solid white', 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)' 
                }}
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN: MISIÓN Y VISIÓN */}
        <section className="row my-5">
          {/* Tarjeta de Misión */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card h-100 border-0 shadow-sm" style={{ 
              backgroundColor: '#029e99', // Color verde claro
              color: 'white'             // Texto blanco
            }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <FaBullseye style={{ 
                    fontSize: '2.5rem', 
                    color: '#ffd700' // Color dorado
                  }} />
                </div>
                <h3 className="text-center fw-bold mb-4">MISIÓN</h3>
                <p className="text-center">
                  Potenciar el aprendizaje de nuestros estudiantes a través de Ambientes Virtuales de Aprendizaje, 
                  inmersos en ejemplos del mundo real. Aprovechamos el contexto personal y laboral de cada estudiante 
                  para ayudarles a desarrollar un dominio práctico y significativo de las habilidades de comunicación 
                  en inglés.
                </p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de Visión */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm" style={{ 
              backgroundColor: '#026e6b', // Color verde oscuro
              color: 'white'              // Texto blanco
            }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <FaGlobe style={{ 
                    fontSize: '2.5rem', 
                    color: '#ffd700' // Color dorado
                  }} />
                </div>
                <h3 className="text-center fw-bold mb-4">VISIÓN</h3>
                <p className="text-center">
                  Consolidarnos como líderes indiscutibles en la enseñanza de idiomas en línea, utilizando métodos 
                  y aplicaciones didácticas innovadoras y de vanguardia. A través de plataformas de aprendizaje de 
                  última generación, buscamos capacitar a nuestros estudiantes para que sean bilingües en el corto 
                  plazo y altamente competitivos en cualquier parte del mundo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: NUESTRO EQUIPO */}
        <section className="my-5">
          <h2 className="text-center fw-bold mb-5" style={{ color: '#029e99' }}>
            Nuestro Equipo
          </h2>
          
          <div className="row">
            {/* Mapeo de miembros del equipo */}
            {[
              {
                name: 'María González',
                role: 'Directora Académica',
                bio: 'Especialista en educación virtual con más de 15 años de experiencia en enseñanza de idiomas.',
                img: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'Carlos Mendoza',
                role: 'Coordinador Tecnológico',
                bio: 'Experto en plataformas educativas y desarrollo de aplicaciones para el aprendizaje.',
                img: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              {
                name: 'Laura Jiménez',
                role: 'Jefa de Instructores',
                bio: 'Lingüista con maestría en enseñanza de inglés como segunda lengua.',
                img: 'https://randomuser.me/api/portraits/women/63.jpg'
              }
            ].map((member, index) => (
              // Tarjeta por cada miembro del equipo
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 border-0 shadow-sm">
                  <img 
                    src={member.img} 
                    className="card-img-top" 
                    alt={member.name}
                    style={{ 
                      height: '250px',    // Altura fija
                      objectFit: 'cover'  // Ajuste de imagen
                    }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold" style={{ color: '#029e99' }}>
                      {member.name}
                    </h5>
                    <p className="text-muted">{member.role}</p>
                    <p className="card-text">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}