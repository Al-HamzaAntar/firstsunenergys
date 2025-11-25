
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Battery, Globe, Zap, Wrench, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t, isRTL } = useLanguage();
  
  const services = [
    {
      titleKey: "services.design.title",
      descriptionKey: "services.design.description",
      icon: Building
    },
    {
      titleKey: "services.battery.title", 
      descriptionKey: "services.battery.description",
      icon: Battery
    },
    {
      titleKey: "services.offgrid.title",
      descriptionKey: "services.offgrid.description", 
      icon: Globe
    },
    {
      titleKey: "services.equipment.title",
      descriptionKey: "services.equipment.description",
      icon: Zap
    },
    {
      titleKey: "services.support.title",
      descriptionKey: "services.support.description",
      icon: Wrench
    },
    {
      titleKey: "services.consultation.title",
      descriptionKey: "services.consultation.description",
      icon: Lightbulb
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-solar-blue"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <service.icon className="w-12 h-12 text-solar-blue" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                  {t(service.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed text-center">
                  {t(service.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
