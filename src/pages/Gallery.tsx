
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, Copy, MessageCircle, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { en: 'All Products', ar: 'جميع المنتجات' },
  { en: 'Inverters', ar: 'العاكسات' },
  { en: 'Solar Panels', ar: 'الألواح الشمسية' },
  { en: 'Accessories', ar: 'الإكسسوارات' },
  { en: 'Installation Tools', ar: 'أدوات التركيب' },
  { en: 'Measurement Tools', ar: 'أدوات القياس' },
  { en: 'Security Systems', ar: 'أنظمة الأمان' },
  { en: 'Storage Systems', ar: 'أنظمة التخزين' },
  { en: 'Control Systems', ar: 'أنظمة التحكم' },
  { en: 'Water Pumps', ar: 'مضخات المياه' },
  { en: 'Safety Equipment', ar: 'معدات السلامة' },
];

// Types
type Lang = "ar" | "en";

type Category = {
  id: string;
  label: Record<Lang, string>;
};

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  badge?: string | null;
  badgeEn?: string | null;
  categoryId: string;
  image: string;
};

// Responsive columns hook (match Tailwind breakpoints)
const useGridColumns = () => {
  const getCols = () => {
    const w = window.innerWidth;
    if (w >= 1280) return 4;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  };
  const [cols, setCols] = useState<number>(getCols());
  useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
};



const Gallery = () => {
  const { language, isRTL, t } = useLanguage();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("All Products");
  const [showAll, setShowAll] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GalleryItem | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const cols = useGridColumns();
  
  // Fetch products from database
  const { data: products, isLoading } = useQuery({
    queryKey: ["main_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("main_products")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
  // SEO basics (title + meta description)
  useEffect(() => {
    const titleAr = "معرض المنتجات | طاقة شمسية";
    const titleEn = "Products Gallery | Solar";
    document.title = language === "ar" ? titleAr : titleEn;

    const descAr = "اكتشف مجموعتنا الواسعة من أحدث منتجات الطاقة الشمسية والمعدات المتخصصة";
    const descEn = "Explore our wide selection of the latest solar products and specialized equipment.";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = language === "ar" ? descAr : descEn;
  }, [language]);

  // Reset pagination when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Convert database products to GalleryItem format
  const items = useMemo(() => {
    if (!products) return [];
    return products.map((product) => ({
      id: product.id,
      title: language === 'ar' ? product.name_ar : product.name_en,
      description: language === 'ar' ? product.description_ar : product.description_en,
      badge: language === 'ar' ? product.badge_ar : product.badge_en,
      badgeEn: product.badge_en,
      categoryId: "all",
      image: product.image_url,
    }));
  }, [products, language]);

  const filteredItems = (categoryEn: string) => {
    let filtered = categoryEn === "All Products" 
      ? items 
      : items.filter((it) => it.badgeEn === categoryEn);
    
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleProductClick = (item: GalleryItem) => {
    setSelectedProduct(item);
    setShowProductModal(true);
  };

  const handleWhatsAppContact = () => {
    if (selectedProduct) {
      tryWhatsAppConnection(selectedProduct);
    }
  };

  const tryWhatsAppConnection = async (item: GalleryItem) => {
    setIsConnecting(true);
    const title = item.title;
    const imageUrl = item.image;
    const message = language === "ar" 
      ? `مرحباً، أرغب في الاستفسار عن المنتج: ${title}\n${imageUrl}`
      : `Hello, I would like to inquire about the product: ${title}\n${imageUrl}`;
    
    const whatsappNumber = "781116611";
    const encodedMessage = encodeURIComponent(message);
    
    const methods = [
      // Method 1: wa.me (most reliable)
      () => `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      // Method 2: WhatsApp app scheme
      () => `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`,
      // Method 3: Web WhatsApp
      () => `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`,
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        const url = methods[i]();
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        // Give it time to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if window opened successfully
        if (newWindow && !newWindow.closed) {
          setIsConnecting(false);
          toast({
            title: language === "ar" ? "تم فتح واتساب" : "WhatsApp Opened",
            description: language === "ar" ? "تم توجيهك إلى واتساب" : "You've been redirected to WhatsApp",
          });
          return;
        }
      } catch (error) {
        
      }
    }
    
    // If all methods fail, show modal with alternatives
    setIsConnecting(false);
    setShowContactModal(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: language === "ar" ? "تم النسخ" : "Copied",
        description: language === "ar" ? "تم نسخ النص إلى الحافظة" : "Text copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: language === "ar" ? "تم النسخ" : "Copied",
        description: language === "ar" ? "تم نسخ النص إلى الحافظة" : "Text copied to clipboard",
      });
    }
  };

  const handleManualContact = () => {
    if (!selectedProduct) return;
    
    const title = selectedProduct.title;
    const imageUrl = selectedProduct.image;
    const message = language === "ar" 
      ? `مرحباً، أرغب في الاستفسار عن المنتج: ${title}\n${imageUrl}`
      : `Hello, I would like to inquire about the product: ${title}\n${imageUrl}`;
    
    const contactInfo = `${language === "ar" ? "رقم واتساب:" : "WhatsApp:"} +967 781116611\n${language === "ar" ? "الرسالة:" : "Message:"} ${message}`;
    copyToClipboard(contactInfo);
  };

  const renderProductGrid = (list: GalleryItem[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((item) => {
          const title = item.title;
          const chip = item.badge;
          return (
            <Card
              key={item.id}
              className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden bg-white cursor-pointer"
              onClick={() => handleProductClick(item)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-64 object-contain bg-gray-50 p-4 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {chip && (
                  <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {chip}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                {chip && <p className="text-gray-600 text-sm">{chip}</p>}
                <div className="mt-3 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {language === "ar" ? "اضغط للتواصل عبر الواتساب" : "Click to contact via WhatsApp"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const initialVisible = cols * 3;
  const totalActive = filteredItems(activeCategory).length;
  const shouldShowButton = !showAll && totalActive > initialVisible;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Link
                to="/"
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                {isRTL ? (
                  <ArrowRight className="w-5 h-5 ml-2" />
                ) : (
                  <ArrowLeft className="w-5 h-5 mr-2" />
                )}
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "ar" ? "معرض منتجاتنا" : "Our Products Gallery"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {language === "ar"
                ? "اكتشف مجموعتنا الواسعة من أحدث منتجات الطاقة الشمسية والمعدات المتخصصة"
                : "Explore our wide selection of the latest solar products and specialized equipment."}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content with Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <Input
                type="text"
                placeholder={language === "ar" ? "ابحث عن المنتجات..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v)} className="w-full">
            {/* Desktop Tabs */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 mb-8 h-auto p-1 bg-white shadow-lg rounded-xl gap-1">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.en}
                  value={category.en}
                  className="text-sm font-medium px-3 py-2 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300"
                >
                  {language === 'ar' ? category.ar : category.en}
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((category) => {
              const list = filteredItems(category.en);
              const isActive = category.en === activeCategory;
              const itemsToRender = isActive ? (showAll ? list : list.slice(0, initialVisible)) : list;
              return (
                <TabsContent key={category.en} value={category.en} className="mt-8">
                  {renderProductGrid(itemsToRender)}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-12">
            {shouldShowButton && (
              <button
                onClick={() => setShowAll(true)}
                className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {language === "ar" ? "عرض المزيد من المنتجات" : "Load more products"}
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Details Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedProduct.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-48 object-contain p-4"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  {selectedProduct.badge && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 mb-1">
                        {language === "ar" ? "التصنيف" : "Category"}
                      </h3>
                      <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {selectedProduct.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      {language === "ar" ? "اسم المنتج" : "Product Name"}
                    </h3>
                    <p className="text-base font-medium text-gray-900">
                      {selectedProduct.title}
                    </p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 mb-1">
                        {language === "ar" ? "الوصف" : "Description"}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* WhatsApp Contact Button */}
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-base font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === "ar" ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {language === "ar" ? "طرق التواصل البديلة" : "Alternative Contact Methods"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === "ar" 
                ? "يبدو أن واتساب محجوب أو غير متاح. يمكنك استخدام الطرق التالية للتواصل:"
                : "WhatsApp seems to be blocked or unavailable. You can use these alternative methods:"}
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleManualContact}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
                {language === "ar" ? "نسخ معلومات الاتصال" : "Copy Contact Info"}
              </Button>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {language === "ar" ? "رقم الواتساب:" : "WhatsApp Number:"}
                </p>
                <p className="text-sm font-mono">+967 781116611</p>
                
                {selectedProduct && (
                  <>
                    <p className="text-sm font-medium mb-1 mt-2">
                      {language === "ar" ? "المنتج:" : "Product:"}
                    </p>
                    <p className="text-sm" dir={language === "ar" ? "rtl" : "ltr"}>{selectedProduct.title}</p>
                  </>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {language === "ar" 
                  ? "يمكنك نسخ المعلومات وإرسالها عبر أي تطبيق مراسلة أو البريد الإلكتروني"
                  : "You can copy this information and send it via any messaging app or email"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isConnecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>
              {language === "ar" ? "جارٍ الاتصال بواتساب..." : "Connecting to WhatsApp..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
