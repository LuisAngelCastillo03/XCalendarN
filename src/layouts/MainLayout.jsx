import React from 'react'

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <header>
        {/* Header content */}
        <nav>Navegación</nav>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer>
        {/* Footer content */}
        <p>Footer</p>
      </footer>
    </div>
  )
}

export default MainLayout