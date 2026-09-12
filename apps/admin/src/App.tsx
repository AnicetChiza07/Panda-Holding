import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout'; // ✅ Chemin original restauré

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SectorsPage from './pages/SectorsPage';
import ArticlesPage from './pages/ArticlesPage';
import ProjectsPage from './pages/ProjectsPage';
import PartnersPage from './pages/PartnersPage';
import FaqsPage from './pages/FaqsPage';
import CarouselPage from './pages/CarouselPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import TestimonialsPage from './pages/TestimonialsPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#023047',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                        },
                        success: {
                            iconTheme: {
                                primary: '#46c2c5',
                                secondary: '#023047',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/sectors" element={<SectorsPage />} />
                        <Route path="/articles" element={<ArticlesPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/partners" element={<PartnersPage />} />
                        <Route path="/faqs" element={<FaqsPage />} />
                        <Route path="/carousel" element={<CarouselPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;