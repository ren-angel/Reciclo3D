import Logo from '../assets/Logo.png';

export default function HomeHeader() {
    return(
      <header className="site-header">
        <div className="container header-inner">
          <img src={Logo} alt="ReCiclo3D Logo" className="logo" aria-hidden />
          <div className='header-links'>
            <a href="#about">Sobre Nós</a>
            <a href="#contact">Objetivos</a>
            <a href="#services">Serviços</a>
          </div>
        </div>
      </header>
    )
}