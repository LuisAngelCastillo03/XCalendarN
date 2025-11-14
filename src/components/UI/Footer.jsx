import React from 'react';
// Importación  para usar JSX y componentes de React

export default function Footer() {
  // Definición del componente Footer como función por defecto
  return (
    <div className="mt-4">
      {/* Contenedor principal con margen superior */}
      <footer className="bg-dark text-white py-3" style={{ 
        borderTop: '1px solid rgba(10, 248, 155, 0.1)'
      }}>
        {/* Elemento footer con:
           - Clases de Bootstrap: bg-dark (fondo oscuro), text-white (texto blanco), py-3 (padding vertical)
           - Estilo inline: borde superior con color personalizado */}
        
        <div className="container">
          {/* Contenedor Bootstrap para centrar el contenido y dar márgenes responsivos */}
          
          {/* Contenido compacto en una sola fila */}
          <div className="row align-items-center">
            {/* Fila Bootstrap con elementos alineados verticalmente al centro */}
            
            {/* Sección de Contacto */}
            <div className="col-md-6 mb-2 mb-md-0">
              {/* Columna que ocupa 6/12 en pantallas medianas (md) y más grandes
                  mb-2: margen inferior pequeño en móviles
                  mb-md-0: elimina margen inferior en pantallas md+ */}
              
              <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.85rem' }}>
                {/* Contenedor flexible que permite wrap y con espacio entre elementos de 3 unidades */}
                
                {/* Teléfono 1 */}
                <div className="d-flex align-items-center">
                  {/* Elemento flexible con alineación vertical al centro */}
                  <i className="bi bi-telephone me-2" style={{ color: '#0af89b', fontSize: '0.9rem' }}></i>
                  {/* Icono de teléfono de Bootstrap Icons con:
                      - margen derecho (me-2)
                      - color personalizado (#0af89b)
                      - tamaño de fuente ligeramente mayor */}
                  <span>55 3567 8120</span>
                </div>
                
                {/* Teléfono 2 */}
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone me-2" style={{ color: '#0af89b', fontSize: '0.9rem' }}></i>
                  <span>442 550 5525</span>
                </div>
                
                {/* Email */}
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope me-2" style={{ color: '#0af89b', fontSize: '0.9rem' }}></i>
                  <a href="mailto:aromero@elon.school" className="text-white text-decoration-none" style={{ fontSize: '0.85rem' }}>
                    {/* Enlace de email con:
                        - texto blanco
                        - sin subrayado (text-decoration-none)
                        - tamaño de fuente consistente */}
                    aromero@elon.school
                  </a>
                </div>
              </div>
            </div>

            {/* Sección de Redes Sociales y Copyright */}
            <div className="col-md-6">
              {/* Columna que ocupa 6/12 en pantallas medianas (md) y más grandes */}
              
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-3">
                
                {/* Redes sociales */}
                <div className="d-flex gap-2">
                  {/* Contenedor flexible para iconos con espacio entre ellos */}
                  
                  {/* Facebook */}
                  <a href="https://facebook.com/profile.php?id=61555920905204&mibextid=ZbWKwL" 
                    target="_blank" rel="noopener noreferrer"
                    className="text-white" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    <i className="bi bi-facebook"></i>
                  </a>
                  
                  {/* Instagram */}
                  <a href="https://instagram.com/elon.school/?igsh=M29ucW41dXdqdWFz" 
                    target="_blank" rel="noopener noreferrer"
                    className="text-white" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    <i className="bi bi-instagram"></i>
                  </a>
                  
                  {/* TikTok */}
                  <a href="https://tiktok.com/@elon.school.oficial?_t=8nMfULz3U1u&_r=1" 
                    target="_blank" rel="noopener noreferrer"
                    className="text-white" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    <i className="bi bi-tiktok"></i>
                  </a>
                  
                  {/* YouTube */}
                  <a href="https://youtube.com/@expresslearningonline?si=JJO2l2gpuhIo06i7" 
                    target="_blank" rel="noopener noreferrer"
                    className="text-white" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    <i className="bi bi-youtube"></i>
                  </a>
                </div>

                {/* Copyright y enlaces legales */}
                <div className="d-flex gap-2 align-items-center" style={{ fontSize: '0.75rem' }}>
                  {/* Contenedor flexible con espacio entre elementos y alineación vertical */}
                  
                  <span className="text-white-50">© ELON School</span>
                  {/* Texto de copyright con color blanco atenuado */}
                  
                  <a href="#" className="text-white-50 text-decoration-none">· Términos</a>
                  {/* Enlace a términos con:
                      - punto separador
                      - color blanco atenuado
                      - sin subrayado */}
                  
                  <a href="#" className="text-white-50 text-decoration-none">· Privacidad</a>
                  {/* Enlace a política de privacidad con mismo estilo */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}