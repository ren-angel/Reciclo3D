import Logo from '../assets/Logo.png';
import instagramIcon from '../assets/instagram.svg';
import facebookIcon from '../assets/facebook.svg';
import linkedinIcon from '../assets/linkedin.png';

export default function HomeFooter() {
    return(
      <footer className="site-footer">
        <div className="container footer-inner">
            <div className='footer-left'>
                <img src={Logo} alt="ReCiclo3D Logo" className="footer-logo" aria-hidden />
                <div className='footer-social'>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='instagram-logo'>
                        <img src={instagramIcon} alt="Instagram" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='facebook-logo'>
                        <img src={facebookIcon} alt="Facebook" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='linkedin-logo'>
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                </div>
            </div>
            <div className='footer-contact'>
                <div className='footer-email'>
                    <p>Curabitur quis diam ullamcorper, fermentum tellus:</p>
                    <a href="mailto:#">#</a>
                </div>
                <div className='footer-phone'>
                    <p>Curabitur quis diam ullamcorper:</p>
                    <a href="https://wa.me/#" target="_blank" rel="noopener noreferrer">Clique aqui para enviar uma mensagem pelo WhatsApp</a>
                </div>
            </div>
        </div>
        <small>© {new Date().getFullYear()} ReCiclo3D®. Todos os direitos reservados.</small>
      </footer>
    )
}