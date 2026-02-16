// Temporary main page. Properly separate pages and components later.
// order: services (finish them with admin panel) → utils if necessary → components (shared, then page-specific) → pages → routes? → styles (global, then page/component-specific)
// order 2: main, login and then admin

// https://picsum.photos/200/300

import React from 'react'
import Logo from './assets/Logo.png';

export default function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <img src={Logo} alt="ReCiclo3D Logo" className="logo" aria-hidden />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-text">
              <h1>Em Breve</h1>
              <p className="lead">
                Aliquam vulputate orci vel nisl ultrices dictum. Donec gravida, sapien a tempor ultricies,
                nunc elit ultricies diam, id pulvinar quam nibh mattis ligula.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#contact">Quero saber mais</a>
                <a className="btn btn-ghost" href="#services">Nossos serviços</a>
              </div>
            </div>

            <div className="hero-art" aria-hidden>
              {/* decorative shapes to match PDF layout */}
              <svg viewBox="0 0 300 300" className="blob">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#fff1f6"/>
                    <stop offset="1" stopColor="#ffe9d6"/>
                  </linearGradient>
                </defs>
                <path fill="url(#g1)" d="M67.7,-32.6C74.6,1.7,61.9,36.8,36.4,53.6C10.9,70.4,-24.4,68.9,-47,51.3C-69.5,33.7,-79.3,-0.1,-70.3,-33.7C-61.3,-67.3,-33.5,-100.8,-0.3,-100.5C32.9,-100.1,65.5,-65,67.7,-32.6Z" transform="translate(150 150)" />
              </svg>
            </div>
          </div>
        </section>

        <section className="section about">
          <div className="container">
            <h2>Sobre Nós</h2>
            <p>
              Sed ornare et purus non pretium. Maecenas pellentesque, mauris nec faucibus vestibulum, nisi diam blandit eros,
              sit amet fermentum sem nisl vitae dui. Aliquam iaculis ullamcorper leo, et laoreet nisi scelerisque sed.
            </p>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="container">
            <h2>Serviços</h2>
            <div className="services-grid">
              {['Fusce faucibus placerat risus, ac ultricies neque', 'Fusce faucibus placerat risus, ac ultricies neque', 'Fusce faucibus placerat risus, ac ultricies neque', 'Fusce faucibus placerat risus, ac ultricies neque'].map((t,i)=>(
                <article className="card" key={i}>
                  <div className="card-icon">⋆</div>
                  <h3>Serviço {i+1}</h3>
                  <p>{t}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container contact-inner">
            <div className="contact-card">
              <h3>Fale conosco</h3>
              <p>Curabitur quis diam ullamcorper, fermentum tellus.</p>
              <a className="btn btn-primary" href="mailto:example@example.com">Enviar e-mail</a>
            </div>
            <div className="contact-info">
              <p><strong>Telefone</strong><br/>(99) 99999-9999</p>
              <p><strong>Email</strong><br/>example@example.com</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <small>© {new Date().getFullYear()} ReCiclo3D®. Todos os direitos reservados.</small>
          <nav>
            <a href="#services">Serviços</a>
            <a href="#about">Sobre</a>
            <a href="#contact">Contato</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
