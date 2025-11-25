import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const News = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', language, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        query = query.or(
          language === 'ar' 
            ? `title_ar.ilike.${searchPattern},excerpt_ar.ilike.${searchPattern},content_ar.ilike.${searchPattern}`
            : `title_en.ilike.${searchPattern},excerpt_en.ilike.${searchPattern},content_en.ilike.${searchPattern}`
        );
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">
            {language === 'ar' ? 'الأخبار' : 'News'}
          </h1>

          {/* Search Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={language === 'ar' ? 'ابحث في الأخبار...' : 'Search articles...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(showAll ? articles : articles.slice(0, 6)).map((article) => (
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
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {language === 'ar' ? article.title_ar : article.title_en}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {language === 'ar' ? article.excerpt_ar : article.excerpt_en}
                    </p>
                  </CardContent>
                </Card>
                ))}
              </div>
              
              {!showAll && articles.length > 6 && (
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    onClick={() => setShowAll(true)}
                    className="gap-2"
                  >
                    {language === 'ar' ? 'تحميل المزيد من المقالات' : 'Load more articles'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'ar' ? 'لا توجد أخبار متاحة حالياً' : 'No news available at the moment'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default News;
