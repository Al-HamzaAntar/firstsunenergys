
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Products = () => {
  const { language } = useLanguage();
  const { t } = useLanguage();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['main-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_products')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-solar-blue" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products?.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
                  <div className="relative">
                    <img 
                      src={product.image_url} 
                      alt={language === 'ar' ? product.name_ar : product.name_en}
                      className="w-full h-48 object-contain bg-white p-4"
                    />
                    {(product.badge_en || product.badge_ar) && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-solar-yellow text-black px-3 py-1 rounded-full text-sm font-semibold">
                          {language === 'ar' ? product.badge_ar : product.badge_en}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                      {language === 'ar' ? product.name_ar : product.name_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {language === 'ar' ? product.description_ar : product.description_en}
                    </CardDescription>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Products;
