import PhaseCard from '../components/roadmap/PhaseCard.jsx';

const phaseHighlights = [
  {
    title: 'Phase 0: Foundations',
    goal: 'Project structure, environment setup, and core data model planning.'
  },
  {
    title: 'Phase 1: Multi-Tenant MVP',
    goal: 'Restaurant isolation, menu APIs, and slug-based restaurant pages.'
  },
  {
    title: 'Phase 2-3: Sessions + Real-Time Cart',
    goal: 'QR table sessions and shared live cart with Socket.IO rooms.'
  },
  {
    title: 'Phase 4-7: KDS, OTP, Billing, Payments',
    goal: 'End-to-end operational flow from order creation to paid bill status.'
  },
  {
    title: 'Phase 8-10: Notifications + Production Readiness',
    goal: 'Receipts, analytics, reliability hardening, and launch polish.'
  }
];

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero section-fade-up">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Phase 0 - System Foundation</p>
            <h1>QR-based multi-restaurant ordering platform</h1>
            <p className="hero-copy">
              One platform, many restaurants. This starter is designed for clean multi-tenancy,
              real-time collaboration, and secure billing workflows from day one.
            </p>
            <div className="hero-meta-row">
              <span className="pill">React + Vite</span>
              <span className="pill">Express + Socket.IO</span>
              <span className="pill">MongoDB Atlas</span>
            </div>
          </div>

          <div className="hero-card" aria-label="Architecture snapshot">
            <h2>Architecture Snapshot</h2>
            <ul>
              <li>Tenant-scoped backend APIs</li>
              <li>Table-session room model for sockets</li>
              <li>TTL-ready collections for OTP and sessions</li>
              <li>Role-based admin capabilities</li>
              <li>Cash and online payment workflow support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="roadmap section-fade-up section-delay-1">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Development Roadmap</p>
            <h2>Build in deliberate phases</h2>
          </div>

          <div className="phase-grid">
            {phaseHighlights.map((phase) => (
              <PhaseCard key={phase.title} title={phase.title} goal={phase.goal} />
            ))}
          </div>
        </div>
      </section>

      <section className="principles section-fade-up section-delay-2">
        <div className="container principles-grid">
          <article>
            <h3>Security-first defaults</h3>
            <p>OTP verification, rate limiting, input validation, and no card storage.</p>
          </article>

          <article>
            <h3>Responsive by default</h3>
            <p>Mobile-first layout that scales cleanly to tablets and desktops.</p>
          </article>

          <article>
            <h3>Interview-ready quality</h3>
            <p>Clear architecture docs, clean code structure, and reproducible setup steps.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
