// Importación de iconos de FontAwesome
import { FaClock, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa';
// Importación de componentes personalizados
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';
export default function Contact() {
  // Enlace de WhatsApp predefinido
  const whatsappLink = "https://wa.link/1mwl5v";

  // URL de embed para el mapa de Google Maps
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3729.869949656644!2d-100.3578229!3d20.6733814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d38f8e0a6e9f2d%3A0x9a5f3e5c3e5f3e5c!2sAv.%20Cayuco%2012%2C%20Zibat%C3%A1%2C%20Qro.!5e0!3m2!1ses!2smx!4v1630000000000!5m2!1ses!2smx";

  return (
    <div className="contact-page" style={{ 
      backgroundColor: '#FFFFFF',    // Fondo blanco
      minHeight: '100vh',           // Altura mínima de toda la pantalla
      color: '#161616',             // Color de texto principal
      paddingTop: '80px'            // Espacio para el navbar fijo
    }}>
      {/* ========== NAVBAR FIJO ========== */}
      <div style={{
        position: 'fixed',          // Posicionamiento fijo
        top: 0,                    // Pegado arriba
        left: 0,                   // Pegado a la izquierda
        width: '100%',             // Ancho completo
        zIndex: 1000               // Z-index alto para asegurar visibilidad
      }}>
        <Navbar />                 {/* Componente Navbar */}
      </div>
      
      {/* ========== HERO SECTION ========== */}
      <section 
        className="contact-hero text-center position-relative"
        style={{
          background: 'linear-gradient(135deg, #0A7E8C 0%, #87CEEB 100%)', // Degradado azul
          padding: '8rem 0 6rem',  // Espaciado vertical grande
          minHeight: '40vh'        // Altura mínima del hero
        }}
      >
        <div className="container position-relative" style={{ zIndex: 1 }}>
          {/* Título principal */}
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#FFFFFF' }}>
            Contáctanos
          </h1>
          
          {/* Descripción */}
          <p className="lead mx-auto" style={{ 
            maxWidth: '800px',      // Ancho máximo para mejor legibilidad
            color: '#FFFFFF',       // Texto blanco
            fontSize: '1.25rem'    // Tamaño de fuente aumentado
          }}>
            Estamos aquí para responder todas tus preguntas. ¡Escríbenos por WhatsApp!
          </p>
          
          {/* Botón principal de WhatsApp */}
          <div className="mt-4">
            <a 
              href={whatsappLink} 
              target="_blank"       // Abrir en nueva pestaña
              rel="noopener noreferrer" // Seguridad para enlaces externos
              className="btn btn-lg fw-bold d-inline-flex align-items-center"
              style={{
                backgroundColor: '#25D366', // Color verde de WhatsApp
                color: 'white',             // Texto blanco
                borderRadius: '50px',        // Bordes redondeados
                padding: '0.75rem 2rem',    // Espaciado interno
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Sombra
                fontSize: '1.25rem',        // Tamaño de fuente
                transition: 'transform 0.3s ease' // Transición para hover
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Efecto hover
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}     // Efecto normal
            >
              <FaWhatsapp className="me-2" size={28} /> {/* Icono WhatsApp */}
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="container my-5 py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Tarjeta de información de contacto */}
            <div className="contact-info-card p-4 p-md-5 text-center" style={{
              backgroundColor: '#FFFFFF',        // Fondo blanco
              borderRadius: '15px',             // Bordes redondeados
              boxShadow: '0 10px 30px rgba(10, 126, 140, 0.1)', // Sombra sutil
              border: '1px solid rgba(135, 206, 235, 0.3)' // Borde sutil
            }}>
              <h2 className="fw-bold mb-5" style={{ color: '#0A7E8C' }}>
                Cómo contactarnos
              </h2>
              
              {/* Tarjeta de WhatsApp */}
              <div className="contact-item mb-5 p-4 mx-auto" style={{
                backgroundColor: 'rgba(37, 211, 102, 0.1)', // Fondo verde claro
                borderRadius: '15px',                      // Bordes redondeados
                borderLeft: '5px solid #25D366',          // Borde lateral verde
                maxWidth: '500px',                        // Ancho máximo
                transition: 'transform 0.3s ease'         // Transición para hover
              }}>
                <div className="icon mb-3" style={{ 
                  color: '#25D366',       // Color verde WhatsApp
                  fontSize: '3rem'       // Tamaño grande para icono
                }}>
                  <FaWhatsapp />         {/* Icono WhatsApp */}
                </div>
                <h3 style={{ color: '#161616' }}>WhatsApp</h3>
                <p className="mb-3" style={{ 
                  color: '#161616',     // Color de texto
                  fontSize: '1.1rem'    // Tamaño de fuente aumentado
                }}>
                  Contáctanos directamente por WhatsApp para una respuesta rápida
                </p>
                <div className="mb-3">
                  <p style={{ color: '#161616', marginBottom: '0.5rem' }}>
                    <strong>442 550 5525</strong> - Querétaro
                  </p>
                </div>
                {/* Botón secundario de WhatsApp */}
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn mt-2"
                  style={{
                    backgroundColor: '#25D366', // Color verde WhatsApp
                    color: 'white',             // Texto blanco
                    borderRadius: '8px',        // Bordes redondeados
                    padding: '0.75rem 2rem',    // Espaciado interno
                    fontSize: '1.1rem',        // Tamaño de fuente
                    fontWeight: '600',         // Grosor de fuente
                    transition: 'all 0.3s ease' // Transición para hover
                  }}
                >
                  <FaWhatsapp className="me-2" />
                  Iniciar chat ahora
                </a>
              </div>

              {/* Sección de otros métodos de contacto */}
              <div className="row mt-5">
                {/* Columna de teléfonos */}
                <div className="col-md-6 mb-4">
                  <div className="contact-item">
                    <div className="icon mb-3" style={{ 
                      color: '#0A7E8C',   // Color azul principal
                      fontSize: '2rem'    // Tamaño de icono
                    }}>
                      <FaPhone />        {/* Icono de teléfono */}
                    </div>
                    <h4 style={{ color: '#161616' }}>Teléfono</h4>
                    <p style={{ color: '#161616' }}>442 550 5525 - Querétaro</p>
                  </div>
                </div>

                {/* Columna de dirección */}
                <div className="col-md-6 mb-4">
                  <div className="contact-item">
                    <div className="icon mb-3" style={{ 
                      color: '#0A7E8C',   // Color azul principal
                      fontSize: '2rem'    // Tamaño de icono
                    }}>
                      <FaMapMarkerAlt />  {/* Icono de ubicación */}
                    </div>
                    <h4 style={{ color: '#161616' }}>Dirección</h4>
                    <p style={{ color: '#161616' }}>
                      Av. Cayuco 12<br />
                      Fracc. Zibatá<br />
                      Municipio El Marqués, Querétaro
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección de horario */}
              <div className="mt-4">
                <div className="contact-item d-inline-block text-center">
                  <div className="icon mb-2" style={{ 
                    color: '#0A7E8C',   // Color azul principal
                    fontSize: '2rem'     // Tamaño de icono
                  }}>
                    <FaClock />         {/* Icono de reloj */}
                  </div>
                  <h4 style={{ color: '#161616' }}>Horario de Atención</h4>
                  <p style={{ color: '#161616' }}>Lunes a Viernes: 7:00 am - 10:00 pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== MAP SECTION ========== */}
        <div className="row mt-5">
          <div className="col-12">
            {/* Tarjeta del mapa */}
            <div className="map-card p-4" style={{
              backgroundColor: '#FFFFFF',        // Fondo blanco
              borderRadius: '15px',             // Bordes redondeados
              boxShadow: '0 10px 30px rgba(10, 126, 140, 0.1)', // Sombra sutil
              border: '1px solid rgba(135, 206, 235, 0.3)' // Borde sutil
            }}>
              <h3 className="fw-bold mb-4 text-center" style={{ color: '#0A7E8C' }}>
                Nuestra Ubicación Exacta
              </h3>
              
              {/* Iframe del mapa de Google */}
              <div className="ratio ratio-16x9"> {/* Relación de aspecto 16:9 */}
                <iframe 
                  src={googleMapsEmbedUrl}
                  style={{ 
                    border: 'none',             // Sin bordes
                    borderRadius: '10px',      // Bordes redondeados
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' // Sombra
                  }}
                  allowFullScreen              // Permitir pantalla completa
                  loading="lazy"               // Carga diferida
                  aria-label="Ubicación exacta en Av. Cayuco 12, Zibatá"
                ></iframe>
              </div>

              {/* Botón para abrir en Google Maps */}
              <div className="text-center mt-3">
                <a
                  href="https://maps.app.goo.gl/5q6vEBCDezXgxnR56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#0A7E8C', // Color azul principal
                    color: 'white',             // Texto blanco
                    padding: '8px 20px',       // Espaciado interno
                    borderRadius: '8px',        // Bordes redondeados
                    fontWeight: '500',         // Grosor de fuente
                    transition: 'all 0.3s ease', // Transición para hover
                    display: 'inline-flex',    // Display flexible
                    alignItems: 'center'       // Centrado vertical
                  }}
                >
                  <FaMapMarkerAlt className="me-2" /> {/* Icono de ubicación */}
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BOTÓN FLOTANTE DE WHATSAPP ========== */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',          // Posicionamiento fijo
          bottom: '30px',             // 30px desde abajo
          right: '30px',              // 30px desde derecha
          backgroundColor: '#25D366', // Color verde WhatsApp
          color: 'white',            // Texto blanco
          width: '70px',              // Ancho fijo
          height: '70px',             // Alto fijo
          borderRadius: '50%',        // Forma circular
          textAlign: 'center',       // Centrado de texto
          fontSize: '36px',          // Tamaño grande de icono
          boxShadow: '0 4px 20px rgba(6, 235, 90, 0.43)', // Sombra verde
          zIndex: 100,               // Z-index alto para visibilidad
          display: 'flex',           // Display flexible
          justifyContent: 'center',  // Centrado horizontal
          alignItems: 'center',      // Centrado vertical
          transition: 'all 0.3s ease' // Transición para hover
        }}
        onMouseOver={(e) => {       // Efectos hover
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(6, 235, 90, 0.6)';
        }}
        onMouseOut={(e) => {        // Efectos normales
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 235, 90, 0.43)';
        }}
        aria-label="Contactar por WhatsApp" // Accesibilidad
      >
        <FaWhatsapp /> {/* Icono WhatsApp */}
      </a>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}