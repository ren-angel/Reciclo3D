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
        <h3>{title}</h3>
        <p>{content}</p>
        <a className="btn btn-primary" href={buttonUrl}>Em breve</a>
      </div>
      <img src="https://picsum.photos/200/300" alt="" />
    </article>
  );
}
