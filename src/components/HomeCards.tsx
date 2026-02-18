// export default function HomeHeader(imgUrl: string, title: string, content: string) {
interface HomeCardsProps {
  title: string;
  content: string;
}

export default function HomeCards({ title, content }: HomeCardsProps) {
  return (
    <article className="home-card">
      <div className="home-card-inner">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      <img src="https://picsum.photos/200/300" alt="" />
    </article>
  );
}
