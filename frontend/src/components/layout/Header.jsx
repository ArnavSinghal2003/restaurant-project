import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand-mark">
          <span className="brand-dot" aria-hidden="true" />
          <span>TableFlow</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Overview</Link>
          <Link to="/r/demo-restaurant">Restaurant View</Link>
          <Link to="/admin">Admin View</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
