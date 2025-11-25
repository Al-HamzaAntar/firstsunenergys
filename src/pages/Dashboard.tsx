import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Package, ArrowUp, Users, Newspaper, Settings as SettingsIcon } from 'lucide-react';
import { ProductsManager } from '@/components/dashboard/ProductsManager';
import { Overview } from '@/components/dashboard/Overview';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { Settings } from '@/components/dashboard/Settings';
import ArticlesManager from '@/components/dashboard/ArticlesManager';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Dashboard = () => {
  const { user, isAdmin, hasAccess, isLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Only redirect after loading is complete and we're certain user lacks access
    if (!isLoading && user && !hasAccess) {
      navigate('/auth');
    } else if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, hasAccess, isLoading, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !user || !hasAccess) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-sm text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button onClick={() => signOut()} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              {t('dashboard.signOut')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'} gap-2`}>
            <TabsTrigger value="overview" className="gap-2">
              <Package className="w-4 h-4" />
              <span>{t('dashboard.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              <span>{t('dashboard.tabs.products')}</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <Newspaper className="w-4 h-4" />
              <span>{t('dashboard.tabs.articles')}</span>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="settings" className="gap-2">
                  <SettingsIcon className="w-4 h-4" />
                  <span>{t('dashboard.tabs.settings')}</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="w-4 h-4" />
                  <span>{t('dashboard.users')}</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.productsManager.title')}</CardTitle>
                <CardDescription>{t('dashboard.productsManager.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.articlesManager.title')}</CardTitle>
                <CardDescription>{t('dashboard.articlesManager.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ArticlesManager />
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="settings">
                <Settings />
              </TabsContent>
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default Dashboard;
