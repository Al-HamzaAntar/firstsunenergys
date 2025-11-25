
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      // On home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-4`}>
              <img 
                src="/images/fristsunlight.webp" 
                alt={t('brand.name')} 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-solar-yellow">{t('brand.name')}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-solar-yellow">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  {t('nav.products')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-solar-yellow transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-solar-yellow">{t('footer.contact')}</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-300">
                <span className="font-semibold">{t('contact.phone')}:</span> 781116611
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">{t('contact.email')}:</span> Admin@FirstSunEn.com
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">{t('contact.address')}:</span> {t('contact.street')}
              </p>
            </div>

            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a 
                href="https://www.facebook.com/p/%D9%81%D8%B1%D8%B3%D8%AA-%D8%B3%D9%86-%D8%A7%D9%86%D8%B1%D8%AC%D9%8A-First-Sun-Energy-61567138172562/" 
                className="w-10 h-10 bg-solar-blue hover:bg-solar-yellow text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
                aria-label={t('social.facebook')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/first_sun_en?igsh=MXdlaWEwbjJtaG5hNg==" 
                className="w-10 h-10 bg-solar-blue hover:bg-solar-yellow text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
                aria-label={t('social.instagram')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/967781116611" 
                className="w-10 h-10 bg-solar-blue hover:bg-solar-yellow text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
                </svg>
              </a>
              <a
                href="https://t.me/firstsunenergy" 
                className="w-10 h-10 bg-solar-blue hover:bg-solar-yellow text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
                aria-label={t('social.telegram')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm5.548 8.327c-.155 1.63-1.052 6.988-1.486 9.275-.183.976-.543 1.302-.89 1.335-.756.07-1.333-.499-2.066-.981-1.147-.749-1.797-1.214-2.91-1.943-1.287-.852-.453-1.321.282-2.087.193-.2 3.548-3.251 3.61-3.53.008-.036.016-.17-.063-.24-.078-.07-.194-.046-.277-.027-.118.027-1.993 1.265-5.627 3.717-.534.366-1.016.546-1.446.535-.476-.01-1.389-.268-2.07-.49-.832-.27-1.49-.412-1.432-.868.03-.236.356-.478.979-.727 3.832-1.672 6.386-2.776 7.666-3.301 3.652-1.519 4.411-1.786 4.91-1.794.108-.002.35.025.507.157.132.109.17.257.187.366a.918.918 0 0 1 .012.225z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              {t('footer.rights')} {t('brand.name')} © {currentYear}
            </p>
            <p className="text-gray-400 mt-2">
              <a 
                href="https://alhamzaantar.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-solar-yellow transition-colors"
              >
                {t('footer.developer')}
              </a>
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
