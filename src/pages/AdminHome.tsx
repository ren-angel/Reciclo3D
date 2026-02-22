import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

import homeAboutService from '../services/homeAboutService';
import homeServicesService from '../services/homeServicesService';

import Logo from "../assets/Logo.png";

export default function AdminHome() {

    const [homeAboutContentText, setHomeAboutContentText] = useState<string>("");
    const [homeServicesContentText, setHomeServicesContentText] = useState<string>("");
    const [cookies] = useCookies(["token"]);
    const navigate = useNavigate();

    type Section = "about" | "services"

    useEffect(() => {

        if (!cookies.token) {

            navigate("/");
        } else {

            const fetchData = async () => {
        
                try {
            
                    const aboutData = await homeAboutService.fetchHomeAboutSection();
                    setHomeAboutContentText(aboutData.homeAboutContentText);
            
                    const servicesData = await homeServicesService.fetchHomeServicesSection();
                    setHomeServicesContentText(servicesData.homeServicesContentText);
                } catch (error: any) {
            
                    toast.error(error.message);
                }
            }
        
            fetchData();
        }
    }, []);

    const handleSubmit = 
        (section: Section) =>
        async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {

            let message: string | undefined;

            if (section === "about") {

                const newBodyContent = { homeAboutContentText };

                message = await homeAboutService.updateHomeAboutSection(cookies.token, newBodyContent);
            } else {

                const newBodyContent = { homeServicesContentText };

                message = await homeServicesService.updateHomeServicesSection(cookies.token, newBodyContent);

            }

            toast.success(message);
        } catch (error: any) {

            toast.error(error.message);
        }
    }

    return (
        <main className="admin-home">
            <img src={Logo} alt="Reciclo3D Logo" className="admin-home-logo" />
            <header className="admin-home-header">
                <h1>Painel de Administração</h1>
                <p className="muted">Gerencie o conteúdo do site.</p>
            </header>

            <section className="admin-grid">
                <div className="admin-column admin-forms">

                <article className="card card-form">
                    <h2 className="card-title">Seção "Sobre Nós"</h2>
                    <form className="admin-form" onSubmit={handleSubmit("about")}>
                        <label htmlFor="homeAboutContentText">Corpo</label>
                        <textarea
                            id="homeAboutContentText"
                            name="homeAboutContentText"
                            rows={6}
                            placeholder="Texto da seção..."
                            // maxLength={}
                            value={homeAboutContentText}
                            onChange={(e) => setHomeAboutContentText(e.target.value)}
                            required
                        />

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </article>

                <article className="card card-form">
                    <h2 className="card-title">Seção "Serviços"</h2>
                    <form className="admin-form" onSubmit={handleSubmit("services")}>
                        <label htmlFor="homeServicesContentText">Corpo</label>
                        <textarea
                            id="homeServicesContentText"
                            name="homeServicesContentText"
                            rows={6}
                            placeholder="Texto da seção..."
                            // maxLength={}
                            value={homeServicesContentText}
                            onChange={(e) => setHomeServicesContentText(e.target.value)}
                            required
                        />

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </article>

                </div>

                {/* <aside className="admin-column admin-preview">
                        <div className="card preview-card">
                            <h3 className="card-title">Pŕe-visualização</h3>
                            <div className="preview-body">
                                <h4 className="preview-title">(Título aparecerá aqui)</h4>
                                <p className="preview-text muted">(Texto aparecerá aqui.)</p>

                                <hr />

                                <h5 className="preview-subtitle">Serviços</h5>
                                <ul className="preview-list muted">
                                    <li>Service item 1</li>
                                    <li>Service item 2</li>
                                    <li>Service item 3</li>
                                </ul>
                            </div> 
                        </div>

                        <div className="preview-actions">
                            <button className="btn btn-secondary">Ir para a Homepage</button>
                        </div>
                    </aside> */}
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Ir para a Homepage</button>
            </section>
        </main>
    );
}