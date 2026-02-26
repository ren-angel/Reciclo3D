// Temporary main page. Properly separate pages and components later.
// order: services (finish them with admin panel) → utils if necessary → components (shared, then page-specific) → pages → routes? → styles (global, then page/component-specific)
// order 2: main, login and then admin

// https://picsum.photos/200/300

import { useState, useEffect } from 'react';
import HomeHeader from '../components/HomeHeader';
import HomeFooter from '../components/HomeFooter';
import HomeCards from '../components/HomeCards';
import HomeObjectives from '../components/HomeObjectives';

import extrusotaPic from '../assets/extrusora.jpg'
import plasticPic from '../assets/plastic.jpg'
import employeeIcon from '../assets/employee.png'
import recycleIcon from '../assets/recycle.png'
import incomeIcon from '../assets/income.png'
import ShieldIcon from '../assets/shield.svg'
import heroArt from '../assets/hero.jpg'; 

import homeAboutService from '../services/homeAboutService';
import homeServicesService from '../services/homeServicesService';

export default function Homepage() {

  const [homeAboutData, setHomeAboutData] = useState(null);
  const [homeServicesData, setHomeServicesData] = useState(null);
  
  useEffect(() => {
  
    const fetchData = async () => {
  
      try {
  
        const aboutData = await homeAboutService.fetchHomeAboutSection();
        setHomeAboutData(aboutData.homeAboutContentText);
  
        const servicesData = await homeServicesService.fetchHomeServicesSection();
        setHomeServicesData(servicesData.homeServicesContentText);
      } catch (error) {
  
        console.error(error);
        // setLoading(false);
      }
    }
  
    fetchData();
  }, []);

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
              <h1>DO RESÍDUO AO VALOR: PLÁSTICO QUE VIRA OPORTUNIDADE</h1>
              <p className="lead">
                Implantamos linhas de coleta e extrusão, fornecemos equipamentos e treinamentos, e entregamos produtos finais e relatórios de conformidade — tudo pensado para reduzir custos, fortalecer sua imagem ESG e criar renda local.
              </p>
            </div>

            <div className="hero-cta">
              <a className="btn btn-primary" href="#services">Nossos Serviços</a>
              <a className="btn btn-secondary" href="/about">Saiba Mais</a>
            </div>
          </div>
      </section>

        <section id="about" className="section home-about">
          <HomeCards
            title="Sobre Nós"
            // content={homeAboutData ? homeAboutData : "Transformamos resíduos plásticos em produtos de valor (filamentos, pellets e brindes) com tecnologia de extrusão e capacitação local, gerando renda para cooperativas e garantia de conformidade ESG."}
            content="Transformamos resíduos plásticos em produtos de valor (filamentos, pellets e brindes) com tecnologia de extrusão e capacitação local, gerando renda para cooperativas e garantia de conformidade ESG."
            imageUrl={plasticPic}
            buttonUrl="/about"
            isService={false}
          />
        </section>

        <section id='objectives' className='home-objectives-parent'>  
          <HomeObjectives
            icon={<img src={employeeIcon} alt="" />}
            title="Capacitação"
            text="Capacitar cooperativas e catadores para operar unidades de triagem e extrusão."
          />
          <HomeObjectives
            icon={<img src={recycleIcon} alt="" />}
            title="Valorização de Resíduos"
            text="Transformar resíduos plásticos em produtos de maior valor agregado."
          />
          <HomeObjectives
            icon={<img src={ShieldIcon} alt="" />}
            title="Compliance & Segurança Jurídica"
            text="Oferecer soluções completas de logística reversa e compliance para empresas e eventos."
          />
          <HomeObjectives
            icon={<img src={incomeIcon} alt="" />}
            title="Impacto Social & Renda" 
            text="Gerar renda e impacto social mensurável."
          />
        </section>

        <section id="services" className="section home-services">
          <HomeCards
            title="Nossos Serviços"
            // content={homeServicesData ? homeServicesData : "Oferecemos diagnóstico, implantação e operação de linhas de triagem e extrusão que convertem plástico pós-consumo em filamento para impressão 3D, pellets e brindes personalizados. Com opções de venda, locação de unidades móveis para eventos e contratos de manutenção (SLA), você mitiga riscos legais e transforma sua obrigação ambiental em ativo de reputação. Trabalhamos com cooperativas parceiras e programas públicos para escalar impacto social e cumprir a legislação vigente."}
            content="Oferecemos diagnóstico, implantação e operação de linhas de triagem e extrusão que convertem plástico pós-consumo em filamento para impressão 3D, pellets e brindes personalizados. Com opções de venda, locação de unidades móveis para eventos e contratos de manutenção (SLA), você mitiga riscos legais e transforma sua obrigação ambiental em ativo de reputação. Trabalhamos com cooperativas parceiras e programas públicos para escalar impacto social e cumprir a legislação vigente."
            imageUrl={extrusotaPic}
            buttonUrl="#"
            isService={true}
          />
        </section>
      </main>
      <HomeFooter />
    </div>
  )
}
