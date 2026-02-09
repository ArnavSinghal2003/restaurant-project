import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RestaurantPage from './pages/RestaurantPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="content-shell">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/r/:slug" element={<RestaurantPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
