import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Building2, FileText, Briefcase, Users, 
    HelpCircle, Image as ImageIcon, MessageSquare, LogOut, Menu, X
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const userAvatar = (user as unknown as { avatar?: string })?.avatar;

    const menuSections = [
        { title: 'VUE D\'ENSEMBLE', items: [{ path: '/', label: 'Dashboard', icon: LayoutDashboard }] },
        {
            title: 'CONTENUS',
            items: [
                { path: '/articles', label: 'Articles', icon: FileText },
                { path: '/sectors', label: 'Secteurs', icon: Building2 },
                { path: '/projects', label: 'Projets', icon: Briefcase },
                { path: '/partners', label: 'Partenaires', icon: Users },
                { path: '/faqs', label: 'FAQ', icon: HelpCircle },
            ]
        },
        { title: 'MEDIAS', items: [{ path: '/carousel', label: 'Carrousel', icon: ImageIcon }] },
        { title: 'COMMUNICATION', items: [{ path: '/messages', label: 'Messages', icon: MessageSquare }] },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name?: string) => {
        if (!name) return 'AD';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ✅ Sidebar : fixed PARTOUT (mobile et desktop). Plus de lg:static */}
            <aside className={`
                fixed top-0 left-0 z-50 h-dvh w-64 bg-[#023047] text-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-x-hidden overflow-y-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 flex flex-col
                scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30
            `}>
                <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#46c2c5] rounded-md flex items-center justify-center">
                            <span className="text-[#023047] font-display font-bold text-sm">PH</span>
                        </div>
                        <h1 className="text-base font-display font-bold tracking-tight">Panda Admin</h1>
                    </div>
                    <button 
                        className="lg:hidden text-white/70 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-6">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h3 className="px-3 mb-2 text-[11px] font-medium text-white/30 uppercase tracking-widest">
                                {section.title}
                            </h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`
                                                flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-[#46c2c5] text-[#023047] shadow-sm' 
                                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                }
                                            `}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <Icon size={18} className={`mr-3 shrink-0 ${isActive ? 'text-[#023047]' : 'text-white/50'}`} />
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#011f2e] shrink-0 space-y-3">
                    <button
                        onClick={() => {
                            setSidebarOpen(false);
                            navigate('/profile');
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#46c2c5]/20 flex items-center justify-center text-[#46c2c5] font-semibold text-xs shrink-0 overflow-hidden border border-[#46c2c5]/30">
                            {userAvatar ? (
                                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                getInitials(user?.name)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'Administrateur'}</p>
                            <p className="text-xs text-white/50 truncate">{user?.email || 'admin@panda.com'}</p>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F4A100] bg-[#F4A100]/10 hover:bg-[#F4A100]/20 border border-[#F4A100]/20 rounded-lg transition-colors"
                    >
                        <LogOut size={16} className="shrink-0" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* ✅ Contenu principal : Ajout de lg:ml-64 pour laisser la place à la sidebar fixed */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shrink-0">
                    <button 
                        className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -ml-2"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Administration</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-900 capitalize">
                            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1] || 'Page'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;