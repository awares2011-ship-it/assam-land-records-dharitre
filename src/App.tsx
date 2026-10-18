import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import { initAds, onNavigate, scheduleAppOpenOnLaunch } from './services/ads';
import Home from './pages/Home';
import LandSearch from './pages/LandSearch';
import Calculator from './pages/Calculator';
import Weather from './pages/Weather';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import News from './pages/News';
import Jamabandi from './pages/Jamabandi';
import Basundhara from './pages/Basundhara';
import Bhunaksha from './pages/Bhunaksha';
import Mutation from './pages/Mutation';
import EKhajana from './pages/EKhajana';
import MarketPrices from './pages/MarketPrices';
import StampDuty from './pages/StampDuty';
import EmiCalculator from './pages/EmiCalculator';
import Faq from './pages/Faq';
import Glossary from './pages/Glossary';
import Feedback from './pages/Feedback';
import About from './pages/About';
import Settings from './pages/Settings';
import SavedServices from './pages/SavedServices';
import NotificationsPage from './pages/Notifications';

export default function App() {
  const loc = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    void initAds();
    scheduleAppOpenOnLaunch();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onNavigate();
  }, [loc.pathname]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/land-search" element={<LandSearch />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/jamabandi" element={<Jamabandi />} />
        <Route path="/basundhara" element={<Basundhara />} />
        <Route path="/bhunaksha" element={<Bhunaksha />} />
        <Route path="/mutation" element={<Mutation />} />
        <Route path="/e-khajana" element={<EKhajana />} />
        <Route path="/market" element={<MarketPrices />} />
        <Route path="/stamp-duty" element={<StampDuty />} />
        <Route path="/emi" element={<EmiCalculator />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/saved" element={<SavedServices />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
