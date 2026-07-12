import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './landingPage/LandingPage';
import OpenAccountPage from './open-account/OpenAccountPage';
import ValidatePage from './validate/ValidatePage';
import KiteDashboard from './dashboard/KiteDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/open-account" element={<OpenAccountPage />} />
        <Route path="/open-account/*" element={<OpenAccountPage />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route path="/dashboard" element={<KiteDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
