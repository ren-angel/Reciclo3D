interface HomeCardsProps {
  title: string;
  content: string;
  buttonUrl: string;
}

// export default function HomeHeader(imgUrl: string, title: string, content: string) {
export default function HomeCards({ title, content, buttonUrl }: HomeCardsProps) {
  return (
    <article className="home-card">
      <div className="home-card-inner">
        <div className="home-card-text">
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
        <a className="btn btn-primary" href={buttonUrl}>Em breve</a>
      </div>
      <div className="home-card-media" aria-hidden>
        <img src="https://picsum.photos/200/300" alt="" />
      </div>
    </article>
  );
}
