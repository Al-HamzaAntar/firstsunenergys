import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const contactInfo = [
    { title: t('contact.primaryEmail'), value: 'Admin@FirstSunEn.com', type: 'email' },
    { title: t('contact.generalInfo'), value: 'Info@FirstSunEn.com', type: 'email' },
    { title: t('contact.maintenance'), value: 'Maintenance@FirstSunEn.com', type: 'email' },
    { title: t('contact.purchases'), value: 'purchases@FirstSunEn.com', type: 'email' },
    { title: t('contact.sales'), value: 'sales@FirstSunEn.com', type: 'email' },
    { title: t('contact.phone'), value: ['784748777', '781116611', '784748555'], type: 'phone' },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">  
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('contact.infoHeading')}</h3>
            <div className="grid gap-4 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-solar-blue">
                      {info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {info.type === "email" ? (
                      <a 
                        href={`mailto:${info.value}`}
                        className="text-gray-700 hover:text-solar-blue transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      // if value is an array, render all phone numbers in the same card
                      Array.isArray(info.value) ? (
                        <div className="flex flex-col space-y-1">
                          {info.value.map((num: string, i: number) => (
                            <a
                              key={i}
                              href={`tel:${num}`}
                              className="text-gray-700 hover:text-solar-blue transition-colors"
                            >
                              {num}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <a 
                          href={`tel:${info.value}`}
                          className="text-gray-700 hover:text-solar-blue transition-colors"
                        >
                          {info.value}
                        </a>
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* removed Address card from here so it can appear under the map */}
          </div>

          {/* Map */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('contact.mapHeading')}</h3>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d236.23846478168036!2d44.220983105233195!3d15.290916651177463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603c50014c6b4e7%3A0xbcc5f407371eca4c!2z2YHYsdiz2Kog2LPZhiDYp9mG2LHYrNmKINmE2YTYt9in2YLYqSDYp9mE2LTZhdiz2YrYqQ!5e1!3m2!1sar!2s!4v1751106207467!5m2!1sar!2s" 
                width="100%" 
                height="615" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>

            {/* Address card moved here (under the map) */}
            <Card className="bg-solar-blue text-white mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t('contact.address')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{t('contact.cityCountry')}</p>
                <p className="text-lg">{t('contact.street')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;