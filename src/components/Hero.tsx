
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t, isRTL } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with new solar farm image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('/images/hero.png')"
        }}
      ></div>
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-orange-600/65"></div>
      
      {/* Floating solar panels animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="animate-float absolute top-20 right-20 w-20 h-16 bg-blue-500 rounded-lg transform rotate-12"></div>
        <div className="animate-float absolute top-32 left-32 w-16 h-12 bg-orange-400 rounded-lg transform -rotate-12" style={{
          animationDelay: '2s'
        }}></div>
        <div className="animate-float absolute bottom-32 right-32 w-24 h-18 bg-blue-600 rounded-lg transform rotate-6" style={{
          animationDelay: '4s'
        }}></div>
        <div className="animate-float absolute bottom-20 left-20 w-18 h-14 bg-orange-500 rounded-lg transform -rotate-6" style={{
          animationDelay: '6s'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            {t('hero.subtitle')}
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105" 
              onClick={() => scrollToSection('services')}
            >
              {t('hero.cta')}
              <ArrowLeft className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToSection('contact')} 
              className="border-white hover:bg-white font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 text-zinc-800"
            >
              <Phone className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5`} />
              {t('hero.contact')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
