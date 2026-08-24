import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';

//Import du ScrollToTop
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages principales
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SectorsPage } from './pages/SectorsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';

// Pages de détails
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SectorDetailPage } from './pages/SectorDetailPage';
import { PortfolioDetailPage } from './pages/PortfolioDetailPage';

// Page 404
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
    return (
        <Router>

            <ScrollToTop />

            <Routes>
                <Route element={<MainLayout><Outlet /></MainLayout>}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Secteurs */}
                    <Route path="/sectors" element={<SectorsPage />} />
                    <Route path="/sectors/:slug" element={<SectorDetailPage />} />

                    {/* Réalisations / Portfolio */}
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />

                    {/* Blog / Actualités */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<ArticleDetailPage />} />
                </Route>

                {/* Route 404 : en dehors du MainLayout */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;