import HomeHeader from '../components/HomeHeader';
import HomeFooter from '../components/HomeFooter';

export default function About() {
  return (
    <div>
        <HomeHeader />
        <main className='about-page'>
            <header className="about-hero">
                <div className="about-hero-text">
                    <h1>Sobre Nós</h1>
                    <p className="lead">
                    Transformamos resíduos plásticos em oportunidade: capacitação para
                    cooperativas, tecnologia de extrusão e soluções completas de
                    logística reversa — tudo para gerar renda, reduzir impacto e
                    cumprir normas ambientais.
                    </p>
                </div>
            </header>

            <section className="about-grid">
                <article className="about-main">
                    <section className="card section-block">
                        <h2>Nossa Missão</h2>
                        <p>
                            Capacitar cooperativas e grandes geradores de resíduos para
                            transformar R-PET e outros plásticos em produtos de maior valor
                            agregado — filamentos para impressão 3D, pellets e brindes —
                            com rastreabilidade e conformidade jurídica.
                        </p>
                    </section>

                    <section className="card section-block">
                        <h2>Como fazemos</h2>
                        <ul className="list">
                            <li>Implementação de unidades de triagem e extrusão “chave na mão”.</li>
                            <li>Treinamento técnico contínuo para cooperados.</li>
                            <li>Serviços de manutenção, vendas de equipamentos e locações para eventos.</li>
                        </ul>
                    </section>

                    <section className="card section-block">
                        <h2>Impacto</h2>
                        <p>
                            Geramos emprego, dignidade e renda para catadores, reduzindo
                            material enviado a aterros e convertendo risco jurídico em
                            ativo de reputação ESG para empresas e eventos.
                        </p>
                    </section>

                    <section className="card section-block">
                        <h2>Indicadores</h2>
                        <p><strong>Produtos gerados:</strong> Filamento, pellets, brindes</p>
                    </section>

                    <section className="card section-block">
                        <h2>Serviços</h2>

                        <article className="about-service">
                            <h3>Consultoria de Logística Reversa</h3>
                            <p>Diagnóstico, projeto e implantação da cadeia de coleta até o beneficiamento, com foco em conformidade legal.</p>
                        </article>

                        <article className="about-service">
                            <h3>Venda e Locação de Máquinas</h3>
                            <p>Extrusoras, trituradores e unidades móveis para eventos — com opção de contrato de manutenção (SLA).</p>
                        </article>

                        <article className="about-service">
                            <h3>Capacitação e Pós-venda</h3>
                            <p>Treinamentos práticos, suporte técnico via WhatsApp e programas continuados para profissionalizar cooperativas.</p>
                        </article>
                    </section>
                </article>

                <aside className="about-side">
                    <div className="card section-block partners">
                        <h2>Parceiros & Credenciais</h2>
                        <p>
                            Trabalhamos com cooperativas locais e com programas públicos e privados para garantir acesso a editais, credenciamento e financiamento.
                        </p>
                        <ul className="partners-list">
                            <li>SP Coopera (parceria institucional)</li>
                            <li>Sebrae / Senai</li>
                            <li>GreenSampa</li>
                        </ul>

                        <div className="contact-cta" id="contact">
                            <h3>Quer transformar resíduos em valor e cumprir sua política ESG?</h3>
                            <a className="btn btn-primary" href="mailto:nauan.l.silva@aluno.senai.br">Fale conosco</a>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
        <HomeFooter />
    </div>
  );
}