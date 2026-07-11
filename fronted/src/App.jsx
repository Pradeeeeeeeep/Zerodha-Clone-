import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './landingPage/LandingPage';
import OpenAccountPage from './open-account/OpenAccountPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/open-account" element={<OpenAccountPage />} />
        <Route path="/open-account/*" element={<OpenAccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
