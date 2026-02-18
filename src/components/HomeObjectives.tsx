import type { ReactNode } from "react";

interface HomeObjectivesProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export default function HomeObjectives({ icon, title, text }: HomeObjectivesProps) {
  return (
    <article className="home-objectives">
        <div className="home-objectives-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{text}</p>
    </article>
  );
}
