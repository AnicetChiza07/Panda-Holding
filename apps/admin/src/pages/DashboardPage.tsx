import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Briefcase, Mail, Users, Image as ImageIcon, 
    TrendingUp, Clock, Loader2, Building2, ArrowRight, MessageSquare
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, RecentMessage, RecentArticle, RecentProject } from '../services/dashboardService';

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
    const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
    const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, messagesRes, articlesRes, projectsRes] = await Promise.all([
                    dashboardService.getStats().catch(() => null),
                    dashboardService.getRecentMessages().catch(() => []),
                    dashboardService.getRecentArticles().catch(() => []),
                    dashboardService.getRecentProjects().catch(() => [])
                ]);

                // ✅ DEBUG : Voir ce que l'API renvoie vraiment
                console.log('Stats response:', statsRes);
                console.log('Messages response:', messagesRes);
                console.log('Articles response:', articlesRes);
                console.log('Projects response:', projectsRes);

                // ✅ Extraction correcte des données
                if (statsRes?.data?.stats) {
                    setStats(statsRes.data.stats);
                } else if (statsRes?.stats) {
                    setStats(statsRes.stats);
                }
                
                // ✅ Gestion flexible des réponses
                setRecentMessages(messagesRes?.data || messagesRes || []);
                setRecentArticles(articlesRes?.data || articlesRes || []);
                setRecentProjects(projectsRes?.data || projectsRes || []);
            } catch (error) {
                console.error('Erreur chargement dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { title: 'Articles', value: stats?.articles?.total || 0, subtitle: `${stats?.articles?.active || 0} actifs`, icon: FileText, color: 'text-[#46c2c5]', bg: 'bg-[#46c2c5]/10', link: '/articles' },
        { title: 'Projets', value: stats?.projects?.total || 0, subtitle: `${stats?.projects?.active || 0} actifs`, icon: Briefcase, color: 'text-[#023047]', bg: 'bg-[#023047]/10', link: '/projects' },
        { title: 'Partenaires', value: stats?.partners?.total || 0, subtitle: `${stats?.partners?.active || 0} actifs`, icon: Building2, color: 'text-[#F4A100]', bg: 'bg-[#F4A100]/10', link: '/partners' },
        { title: 'Témoignages', value: stats?.testimonials?.total || 0, subtitle: `${stats?.testimonials?.active || 0} actifs`, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100', link: '/testimonials' },
        { title: 'Messages', value: stats?.messages?.unread || 0, subtitle: `${stats?.messages?.total || 0} au total`, icon: Mail, color: 'text-red-500', bg: 'bg-red-50', link: '/messages' },
        { title: 'Secteurs', value: stats?.sectors?.total || 0, subtitle: `${stats?.sectors?.active || 0} actifs`, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50', link: '/sectors' },
        { title: 'Carrousel', value: stats?.carousel?.total || 0, subtitle: `${stats?.carousel?.active || 0} actifs`, icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-50', link: '/carousel' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600 mt-2">Vue d'ensemble de l'activité de Panda Holding.</p>
            </div>

            {/* 1. Grille des Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={index}
                            to={card.link}
                            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-[#46c2c5]/30 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                            {card.subtitle && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-[#46c2c5] transition-colors" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* 2. Deux colonnes : Messages et Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Derniers messages */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-[#46c2c5]" />
                            Derniers messages
                        </h2>
                        <Link to="/messages" className="text-sm font-medium text-[#023047] hover:text-[#46c2c5] flex items-center gap-1 transition-colors">
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentMessages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Aucun message reçu pour le moment</p>
                            </div>
                        ) : (
                            recentMessages.slice(0, 5).map((msg: RecentMessage) => (
                                <div key={msg._id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-[#023047]/5 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#023047] font-bold text-sm">{(msg.name ?? 'A').charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-900 truncate">{msg.name ?? 'Anonyme'}</p>
                                            {!msg.isRead && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex-shrink-0 ml-2">
                                                    Nouveau
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{msg.subject ?? 'Pas d\'objet'}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <p className="text-xs text-gray-500">
                                                {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Derniers articles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#F4A100]" />
                            Derniers articles
                        </h2>
                        <Link to="/articles" className="text-sm font-medium text-[#023047] hover:text-[#46c2c5] flex items-center gap-1 transition-colors">
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentArticles.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Aucun article publié pour le moment</p>
                            </div>
                        ) : (
                            recentArticles.slice(0, 5).map((article: RecentArticle) => (
                                <div key={article._id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-[#F4A100]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-[#F4A100]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{article.title ?? 'Sans titre'}</p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {typeof article.sector === 'object' && article.sector !== null && 'name' in article.sector 
                                                ? (article.sector as { name: string }).name
                                                : 'Non catégorisé'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <p className="text-xs text-gray-500">
                                                {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </p>
                                            {article.isFeatured && (
                                                <span className="px-2 py-0.5 bg-[#F4A100]/10 text-[#F4A100] text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                    À la une
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Section pleine largeur : Derniers Projets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[#023047]" />
                        Derniers projets ajoutés
                    </h2>
                    <Link to="/projects" className="text-sm font-medium text-[#023047] hover:text-[#46c2c5] flex items-center gap-1 transition-colors">
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentProjects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>Aucun projet enregistré pour le moment</p>
                        </div>
                    ) : (
                        recentProjects.slice(0, 4).map((project: RecentProject) => (
                            <div key={project._id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 group cursor-pointer">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 group-hover:border-[#46c2c5] transition-colors">
                                    {project.coverImage ? (
                                        <img src={project.coverImage} alt={project.title ?? 'Projet'} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#023047]/5">
                                            <Briefcase className="w-6 h-6 text-[#023047]/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate group-hover:text-[#46c2c5] transition-colors">
                                        {project.title ?? 'Sans titre'}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                        {project.description ?? 'Aucune description disponible.'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        <p className="text-xs text-gray-500">
                                            Ajouté le {new Date(project.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;