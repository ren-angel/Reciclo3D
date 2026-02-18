// Temporary main page. Properly separate pages and components later.
// order: services (finish them with admin panel) → utils if necessary → components (shared, then page-specific) → pages → routes? → styles (global, then page/component-specific)
// order 2: main, login and then admin

// https://picsum.photos/200/300

import React from 'react'
import HomeHeader from './components/HomeHeader'
import HomeCards from './components/HomeCards';
import HomeObjectives from './components/HomeObjectives';
import AlertCircleIcon from './assets/alert-circle.svg'
import BoxIcon from './assets/box.svg'
import CheckmarkIcon from './assets/check.svg'
import ShieldIcon from './assets/shield.svg'
import heroArt from './assets/hero.jpg';

export default function App() {
  return (
    <div className="homepage">
      <HomeHeader />
      <main>
        <section className="hero">
        <div className="hero-bg" aria-hidden>
          <img src={heroArt} alt="" />
        </div>

        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Em Breve</h1>
            <p className="lead">
              Sed ornare et purus non pretium. Maecenas pellentesque, mauris nec faucibus vestibulum, nisi diam blandit eros, sit amet fermentum sem nisl vitae dui. Aliquam iaculis ullamcorper leo, et laoreet nisi scelerisque sed. Suspendisse efficitur rutrum augue, vitae luctus augue vulputate id.
            </p>
          </div>

          <div className="hero-cta">
            <a className="btn btn-primary" href="#services">Nossos Serviços</a>
            <a className="btn btn-secondary" href="#about">Saiba Mais</a>
          </div>
        </div>
      </section>

        <section id="about" className="section home-about">
          <HomeCards
            title="Sobre Nós"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo."
          />
        </section>

        <section>  
          <HomeObjectives
            icon={<img src={ShieldIcon} alt="" />}
            title="Lorem ipsum"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
          <HomeObjectives
            icon={<img src={AlertCircleIcon} alt="" />}
            title="Lorem ipsum"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
          <HomeObjectives
            icon={<img src={BoxIcon} alt="" />}
            title="Lorem ipsum"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
          <HomeObjectives
            icon={<img src={CheckmarkIcon} alt="" />}
            title="Lorem ipsum" 
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </section>

        {/* <section id="services" className="section home-about"> */}
          <HomeCards
            title="Sobre Nós"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo."
          />
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
