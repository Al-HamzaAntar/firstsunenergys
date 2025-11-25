import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Partners from "@/components/Partners";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const { data: galleryProducts, isLoading: isLoadingGallery } = useQuery({
    queryKey: ['gallery-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_products')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: mainProducts, isLoading: isLoadingMain } = useQuery({
    queryKey: ['main-products-index'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_products')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: latestArticles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['latest-articles', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingGallery || isLoadingMain;
  const allProducts = [...(mainProducts || []), ...(galleryProducts || [])];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Services />
      
      {/* Products Carousel Section */}
      <section id="products" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t('products.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : allProducts && allProducts.length > 0 ? (
            <div className="relative px-12">
              <Carousel 
                className="w-full max-w-6xl mx-auto" 
                opts={{ 
                  direction: language === 'ar' ? 'rtl' : 'ltr',
                  loop: true,
                  align: "start",
                  slidesToScroll: 1
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {allProducts.map((product) => {
                    const isMainProduct = 'name_en' in product;
                    return (
                      <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <Card className="group relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
                          <div className="relative">
                            <img 
                              src={product.image_url} 
                              alt={isMainProduct ? (language === 'ar' ? product.name_ar : product.name_en) : t(product.title_key)}
                              className="w-full h-32 object-contain bg-white p-2"
                            />
                            {(isMainProduct ? (product.badge_en || product.badge_ar) : product.category) && (
                              <div className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}`}>
                                <span className="bg-solar-yellow text-black px-2 py-0.5 rounded-full text-xs font-semibold">
                                  {isMainProduct 
                                    ? (language === 'ar' ? product.badge_ar : product.badge_en)
                                    : product.category}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <a 
                                href={(() => {
                                  const title = isMainProduct 
                                    ? (language === 'ar' ? product.name_ar : product.name_en)
                                    : t(product.title_key);
                                  const imageUrl = product.image_url;
                                  const message = language === "ar" 
                                    ? `مرحباً، أرغب في الاستفسار عن المنتج: ${title}\n${imageUrl}`
                                    : `Hello, I would like to inquire about the product: ${title}\n${imageUrl}`;
                                  const whatsappNumber = "781116611";
                                  const encodedMessage = encodeURIComponent(message);
                                  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                                })()}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white font-semibold text-sm px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {language === 'ar' ? 'تواصل عبر واتساب' : 'contact via WhatsApp'}
                              </a>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                              {isMainProduct 
                                ? (language === 'ar' ? product.name_ar : product.name_en)
                                : t(product.title_key)}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                              {isMainProduct 
                                ? (language === 'ar' ? product.description_ar : product.description_en)
                                : t(product.description_key)}
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </Carousel>
            </div>
          ) : null}

          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button size="lg" className="gap-2">
                {t('nav.gallery')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {latestArticles && latestArticles.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {language === 'ar' ? 'آخر الأخبار' : 'Latest News'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'ar' ? 'ابق على اطلاع بأحدث الأخبار والتطورات' : 'Stay updated with our latest news and updates'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {latestArticles.map((article) => {
                const getYouTubeThumbnail = (url: string) => {
                  try {
                    const u = new URL(url);
                    let videoId = '';
                    if (u.hostname.includes('youtu.be')) {
                      videoId = u.pathname.replace('/', '');
                    } else if (u.hostname.includes('youtube.com')) {
                      videoId = u.searchParams.get('v') || '';
                    }
                    if (videoId) {
                      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    }
                  } catch (e) {
                    return null;
                  }
                  return null;
                };

                const isYouTubeUrl = (url: string) => {
                  return /youtu\.be|youtube\.com/.test(url);
                };

                return (
                  <Card 
                    key={article.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    {article.image_url && (
                      <div className="aspect-video w-full overflow-hidden relative group">
                        {article.media_type === 'video' ? (
                          <>
                            <img 
                              src={isYouTubeUrl(article.image_url) 
                                ? getYouTubeThumbnail(article.image_url) || article.image_url
                                : article.image_url
                              } 
                              alt={language === 'ar' ? article.title_ar : article.title_en}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[20px] border-l-primary border-y-[12px] border-y-transparent ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img 
                            src={article.image_url} 
                            alt={language === 'ar' ? article.title_ar : article.title_en}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {language === 'ar' ? article.title_ar : article.title_en}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        {language === 'ar' ? article.excerpt_ar : article.excerpt_en}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Link to="/news">
                <Button size="lg" className="gap-2">
                  {language === 'ar' ? 'عرض جميع الأخبار' : 'View All News'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <Partners />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
