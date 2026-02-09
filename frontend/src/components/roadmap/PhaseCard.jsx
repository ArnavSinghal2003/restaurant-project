function PhaseCard({ title, goal }) {
  return (
    <article className="phase-card">
      <h3>{title}</h3>
      <p>{goal}</p>
    </article>
  );
}

export default PhaseCard;
