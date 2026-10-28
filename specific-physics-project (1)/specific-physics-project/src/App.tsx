import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ChapterPage } from './pages/ChapterPage';
import { Dashboard } from './pages/Dashboard';
import { FormulaLibrary } from './pages/FormulaLibrary';
import { PracticePage } from './pages/PracticePage';
import { SimulationPage } from './simulations/SimulationPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
}

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  return <div className="app-shell"><Sidebar collapsed={false} mobileOpen={mobileOpen} onClose={closeMobile}/><div className="main-column"><Topbar onMenu={() => setMobileOpen((open) => !open)}/><main><Routes><Route path="/" element={<Dashboard/>}/><Route path="/chapter/:chapterId" element={<ChapterPage/>}/><Route path="/simulation/:simulationId" element={<SimulationPage/>}/><Route path="/formulas" element={<FormulaLibrary/>}/><Route path="/practice" element={<PracticePage/>}/><Route path="*" element={<div className="page-content not-found"><h1>Page not found</h1><p>The page may have moved. Choose a chapter and keep experimenting.</p><a href="/" className="button-primary">Back to overview</a></div>}/></Routes></main></div></div>;
}

export default function App() {
  return <BrowserRouter><ScrollToTop/><AppLayout/></BrowserRouter>;
}
