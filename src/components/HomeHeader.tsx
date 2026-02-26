import Logo from '../assets/Logo.png';

export default function HomeHeader() {
    return(
      <header className="site-header">
        <div className="container header-inner">
          <img src={Logo} alt="ReCiclo3D Logo" className="header-logo" aria-hidden />
          <div className='header-links'>
            <a href="/">Home</a>
            <a href="/about">Sobre Nós</a>
            {/* <a href="#objectives">Objetivos</a> */}
            {/* <a href="#services">Serviços</a> */}
          </div>
        </div>
      </header>
    )
}