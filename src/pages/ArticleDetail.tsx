import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowLeft, Share2, Facebook, MessageCircle, Send, Link2, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      // Calculate read progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min((scrollTop / trackLength) * 100, 100);
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = article ? (language === 'ar' ? article.title_ar : article.title_en) : '';

  const isYouTubeUrl = (url: string) => {
    return /youtu\.be|youtube\.com/.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`;
      }
      if (u.hostname.includes('youtube.com')) {
        const videoId = u.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        if (u.pathname.startsWith('/embed/')) return url;
      }
    } catch (e) {
      return url;
    }
    return url;
  };
  const handleShare = async (platform?: string) => {
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
    } else {
      // Use Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: shareUrl,
          });
        } catch (error) {
          console.log('Share cancelled');
        }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Read Progress Bar */}
      <Progress 
        value={readProgress} 
        className="fixed top-0 left-0 right-0 z-50 h-1 rounded-none"
      />
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}
          </Button>

          {isLoading ? (
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-8" />
              <Skeleton className="h-96 w-full mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : article ? (
            <article className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === 'ar' ? article.title_ar : article.title_en}
              </h1>

              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  {new Date(article.created_at).toLocaleDateString(
                    language === 'ar' ? 'ar-EG' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مشاركة:' : 'Share:'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('telegram')}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare()}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {article.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                  {article.media_type === 'video' ? (
                    isYouTubeUrl(article.image_url) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(article.image_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={title}
                      />
                    ) : (
                      <video
                        src={article.image_url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    )
                  ) : (
                    <img
                      src={article.image_url}
                      alt={language === 'ar' ? article.title_ar : article.title_en}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-xl text-muted-foreground mb-6">
                  {language === 'ar' ? article.excerpt_ar : article.excerpt_en}
                </p>
                <div className="whitespace-pre-wrap">
                  {language === 'ar' ? article.content_ar : article.content_en}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'شارك هذا المقال' : 'Share this article'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('whatsapp')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('telegram')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'ar' ? 'المقال غير موجود' : 'Article not found'}
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

export default ArticleDetail;
