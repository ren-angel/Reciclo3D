// Temporary main page. Properly separate pages and components later.
// order: services (finish them with admin panel) → utils if necessary → components (shared, then page-specific) → pages → routes? → styles (global, then page/component-specific)
// order 2: main, login and then admin

// https://picsum.photos/200/300

import React from 'react'
import HomeHeader from './components/HomeHeader'
import HomeFooter from './components/HomeFooter'
import HomeCards from './components/HomeCards';
import HomeObjectives from './components/HomeObjectives';
import AlertCircleIcon from './assets/alert-circle.svg'
import BoxIcon from './assets/box.svg'
import CheckmarkIcon from './assets/check.svg'
import ShieldIcon from './assets/shield.svg'
import heroArt from './assets/hero.jpg';

import homeAboutService from './services/homeAboutService';
import homeServicesService from './services/homeServicesService';

const [homeAboutData, setHomeAboutData] = React.useState(null);
const [homeServicesData, setHomeServicesData] = React.useState(null);

React.useEffect(() => {
  const fetchData = async () _> {

    try {

      const aboutData = await homeAboutService.fetchHomeAboutSection();
      setHomeAboutData(aboutData);

      const servicesData = await homeServicesService.getServicesInfo();
      setHomeServicesData(servicesData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  }
}, []);

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
            buttonUrl="#"
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

        <section id="services" className="section home-services">
          <HomeCards
            title="Sobre Nós"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo."
            buttonUrl="#"
          />
        </section>
      </main>
      <HomeFooter />
    </div>
  )
}
