
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Info, Wrench, Package, Image, Phone, Users, Settings, Newspaper } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { user, isAdmin } = useAuth();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'gallery') {
      navigate('/gallery');
      return;
    }
    
    if (sectionId === 'news') {
      navigate('/news');
      return;
    }
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If on home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable */}
          <Link to="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img 
              src="/images/logo.svg" 
              alt={t('brand.name')} 
              className="h-10 w-auto"
              onClick={() => scrollToSection('home')}
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => scrollToSection('home')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.home')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.about')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.services')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.products')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('partners')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.partners')}</span>
            </button>
            <Link 
              to="/gallery"
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.gallery')}</span>
            </Link>
            <Link 
              to="/news"
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('brand.name') === 'First Sun Energy' ? 'News' : 'الأخبار'}</span>
            </Link>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('nav.contact')}</span>
            </button>
            
            <LanguageSwitcher />
            
            {user && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-lg border-t">
            <nav className="flex flex-col p-4 space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Home size={18} />
                <span>{t('nav.home')}</span>
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Info size={18} />
                <span>{t('nav.about')}</span>
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Wrench size={18} />
                <span>{t('nav.services')}</span>
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Package size={18} />
                <span>{t('nav.products')}</span>
              </button>
              <button 
                onClick={() => scrollToSection('partners')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Users size={18} />
                <span>{t('nav.partners')}</span>
              </button>
              <Link 
                to="/gallery"
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Image size={18} />
                <span>{t('nav.gallery')}</span>
              </Link>
              <Link 
                to="/news"
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Newspaper size={18} />
                <span>{t('brand.name') === 'First Sun Energy' ? 'News' : 'الأخبار'}</span>
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`flex items-center gap-2 text-gray-700 hover:text-solar-blue transition-colors font-medium py-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <Phone size={18} />
                <span>{t('nav.contact')}</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
