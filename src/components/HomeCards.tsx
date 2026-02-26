interface HomeCardsProps {
  title: string;
  content: string;
  imageUrl: string;
  buttonUrl: string;
  isService: boolean;
}

// export default function HomeHeader(imgUrl: string, title: string, content: string) {
export default function HomeCards({ title, content, imageUrl, buttonUrl, isService }: HomeCardsProps) {
  return (
    <article className="home-card">
      <div className="home-card-inner">
        <div className="home-card-text">
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
        <a className="btn btn-primary" href={buttonUrl}>{isService ? "Em Breve" : "Saiba Mais"}</a>
      </div>
      <div className="home-card-media" aria-hidden>
        <img src={`${imageUrl}`} alt="" />
      </div>
    </article>
  );
}
