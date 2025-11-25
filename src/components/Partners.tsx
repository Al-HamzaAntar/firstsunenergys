
import { useLanguage } from '@/contexts/LanguageContext';

const Partners = () => {
  const { t, isRTL } = useLanguage();
  const partners = [
    {
      name: "Mibet Energy",
      logo: "/images/mibet.webp"
    },
    {
      name: "RJETech",
      logo: "/images/rjetech.webp"
    },
    {
      name: "SINENG Electric",
      logo: "/images/sineng.webp"
    },
    {
      name: "Fnirsi",
      logo: "/images/fnirsi.webp"
    },
    {
      name: "Hexcell",
      logo: "/images/hexcell.webp"
    },
    {
      name: "Kuka",
      logo: "/images/kuka.webp"
    },
        {
      name: "TW Solar",
      logo: "/images/tw.webp"
    },
    {
      name: "DANMI",
      logo: "/images/danmi.png"
    }
  ];

  return (
    <section id="partners" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </div>

        {/* Infinite scroll animation */}
        <div className="relative overflow-hidden">
          <div
            className={`flex w-max will-change-transform ${isRTL ? 'animate-scroll-rtl' : 'animate-scroll'}`}
          >
            {/* Two identical sets for seamless looping */}
            {[...Array(2)].map((_, dup) => (
              <div className="flex shrink-0" aria-hidden={dup === 1} key={dup}>
                {partners.map((partner, index) => (
                  <div
                    key={`${dup}-${index}`}
                    className="flex-shrink-0 mx-6 flex items-center justify-center w-36 h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-28 max-h-14 object-contain filter hover:transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
