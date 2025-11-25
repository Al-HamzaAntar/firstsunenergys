import { useState, useCallback, memo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Save, X, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  image_url: string | null;
  media_type: 'image' | 'video';
  published: boolean;
  display_order: number;
  created_at: string;
}

const ArticlesManager = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Article>>({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    excerpt_en: "",
    excerpt_ar: "",
    image_url: "",
    media_type: "image",
    published: false,
    display_order: 0,
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newArticle: Omit<Article, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('articles')
        .insert([newArticle])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: t('toast.articles.createSuccess') });
      setIsAdding(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: t('toast.articles.createError'), description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Article> & { id: string }) => {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: t('toast.articles.updateSuccess') });
      setEditingId(null);
      resetForm();
    },
    onError: (error) => {
      toast({ title: t('toast.articles.updateError'), description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: t('toast.articles.deleteSuccess') });
    },
    onError: (error) => {
      toast({ title: t('toast.articles.deleteError'), description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_ar: "",
      content_en: "",
      content_ar: "",
      excerpt_en: "",
      excerpt_ar: "",
      image_url: "",
      media_type: "image",
      published: false,
      display_order: 0,
    });
  };

  const handleEdit = useCallback((article: Article) => {
    setEditingId(article.id);
    setFormData({
      title_en: article.title_en,
      title_ar: article.title_ar,
      content_en: article.content_en,
      content_ar: article.content_ar,
      excerpt_en: article.excerpt_en,
      excerpt_ar: article.excerpt_ar,
      image_url: article.image_url,
      media_type: article.media_type,
      published: article.published,
      display_order: article.display_order,
    });
  }, []);

  const handleSave = useCallback(() => {
    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId } as Article & { id: string });
    } else if (isAdding) {
      const articleData: Omit<Article, 'id' | 'created_at'> = {
        title_en: formData.title_en || '',
        title_ar: formData.title_ar || '',
        content_en: formData.content_en || '',
        content_ar: formData.content_ar || '',
        excerpt_en: formData.excerpt_en || '',
        excerpt_ar: formData.excerpt_ar || '',
        image_url: formData.image_url || null,
        media_type: formData.media_type || 'image',
        published: formData.published || false,
        display_order: formData.display_order || 0,
      };
      createMutation.mutate(articleData);
    }
  }, [editingId, isAdding, formData, updateMutation, createMutation]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  }, []);

  if (isLoading) {
    return <div>Loading articles...</div>;
  }

  // Filter articles based on search term
  const filteredArticles = articles?.filter((article) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title_en.toLowerCase().includes(searchLower) ||
      article.title_ar.includes(searchTerm) ||
      article.excerpt_en.toLowerCase().includes(searchLower) ||
      article.excerpt_ar.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('dashboard.articlesManager.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding || editingId !== null}>
          <Plus className="w-4 h-4 mr-2" />
          {t('dashboard.articlesManager.addArticle')}
        </Button>
      </div>

      <Dialog open={isAdding || editingId !== null} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAdding ? t('dashboard.articlesManager.addArticle') : t('dashboard.articlesManager.edit')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('dashboard.articlesManager.titleEn')}</Label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="English title"
                />
              </div>
              <div>
                <Label>{t('dashboard.articlesManager.titleAr')}</Label>
                <Input
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="العنوان بالعربية"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('dashboard.articlesManager.excerptEn')}</Label>
                <Textarea
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                  placeholder="Short description in English"
                  rows={3}
                />
              </div>
              <div>
                <Label>{t('dashboard.articlesManager.excerptAr')}</Label>
                <Textarea
                  value={formData.excerpt_ar}
                  onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                  placeholder="وصف قصير بالعربية"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('dashboard.articlesManager.contentEn')}</Label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  placeholder="Full article content in English"
                  rows={6}
                />
              </div>
              <div>
                <Label>{t('dashboard.articlesManager.contentAr')}</Label>
                <Textarea
                  value={formData.content_ar}
                  onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                  placeholder="محتوى المقال كامل بالعربية"
                  dir="rtl"
                  rows={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('dashboard.articlesManager.mediaType')}</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: 'image' | 'video') => setFormData({ ...formData, media_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">{t('dashboard.articlesManager.image')}</SelectItem>
                    <SelectItem value="video">{t('dashboard.articlesManager.video')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formData.media_type === 'video' ? t('dashboard.articlesManager.videoUrl') : t('dashboard.articlesManager.imageUrl')}</Label>
                <Input
                  value={formData.image_url || ""}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder={formData.media_type === 'video' ? "https://youtube.com/watch?v=..." : "https://example.com/image.jpg"}
                />
              </div>
            </div>

            {/* Media Preview */}
            {formData.image_url && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <Label className="mb-2 block">Preview</Label>
                {formData.media_type === 'video' ? (
                  (() => {
                    const getYouTubeThumbnail = (url: string) => {
                      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                      if (videoIdMatch) {
                        return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
                      }
                      return null;
                    };
                    
                    const isYouTube = /(?:youtube\.com|youtu\.be)/.test(formData.image_url || '');
                    const thumbnail = isYouTube ? getYouTubeThumbnail(formData.image_url || '') : null;
                    
                    return (
                      <div className="relative aspect-video bg-black rounded overflow-hidden">
                        {thumbnail ? (
                          <img src={thumbnail} alt="Video preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Video preview unavailable
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="relative aspect-video bg-muted rounded overflow-hidden">
                    <img 
                      src={formData.image_url} 
                      alt="Image preview" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
                      Invalid image URL
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label>{t('dashboard.articlesManager.published')}</Label>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editingId ? t('dashboard.articlesManager.save') : t('dashboard.articlesManager.create')}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                {t('dashboard.articlesManager.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {filteredArticles?.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{article.title_en}</CardTitle>
                  <CardDescription>{article.title_ar}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                    disabled={editingId !== null || isAdding}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={editingId !== null || isAdding}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('dashboard.articlesManager.deleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('dashboard.articlesManager.deleteDescription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('dashboard.articlesManager.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)}>
                          {t('dashboard.articlesManager.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{article.excerpt_en}</p>
                <div className="flex gap-4 text-xs">
                  <span className={article.published ? "text-green-600" : "text-yellow-600"}>
                    {article.published ? t('dashboard.articlesManager.published') : "Draft"}
                  </span>
                  <span>Order: {article.display_order}</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesManager;
