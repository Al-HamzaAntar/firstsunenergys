import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const productSchema = z.object({
  name_en: z.string().trim().min(1, "English name is required").max(200, "Name must be less than 200 characters"),
  name_ar: z.string().trim().min(1, "Arabic name is required").max(200, "Name must be less than 200 characters"),
  description_en: z.string().trim().min(1, "English description is required").max(1000, "Description must be less than 1000 characters"),
  description_ar: z.string().trim().min(1, "Arabic description is required").max(1000, "Description must be less than 1000 characters"),
  badge_en: z.string().max(100).nullable().optional(),
  badge_ar: z.string().max(100).nullable().optional(),
  image_url: z.string().trim().url("Must be a valid URL").max(500, "URL must be less than 500 characters"),
  display_order: z.number().int().min(0, "Order must be a positive number"),
});

const CATEGORIES = [
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

export const ProductsManager = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['main_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_products')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase
        .from('main_products')
        .update(product)
        .eq('id', product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main_products'] });
      toast.success('Product updated');
      setEditingId(null);
    },
    onError: () => toast.error('Failed to update product'),
  });

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase
        .from('main_products')
        .insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main_products'] });
      toast.success('Product created');
      setShowNew(false);
    },
    onError: () => toast.error('Failed to create product'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('main_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main_products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const nameMatch = language === 'ar' 
        ? product.name_ar.toLowerCase().includes(query)
        : product.name_en.toLowerCase().includes(query);
      
      const descMatch = language === 'ar'
        ? product.description_ar.toLowerCase().includes(query)
        : product.description_en.toLowerCase().includes(query);

      const badgeMatch = language === 'ar'
        ? product.badge_ar?.toLowerCase().includes(query)
        : product.badge_en?.toLowerCase().includes(query);

      return nameMatch || descMatch || badgeMatch;
    });
  }, [products, searchQuery, language]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button onClick={() => setShowNew(true)} disabled={showNew}>
          <Plus className="w-4 h-4 mr-2" />
          {t('productsManager.addProduct')}
        </Button>

        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('productsManager.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {showNew && (
        <ProductForm
          onSave={(product) => createMutation.mutate(product)}
          onCancel={() => setShowNew(false)}
          isPending={createMutation.isPending}
        />
      )}

      {filteredProducts.length === 0 && searchQuery ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('productsManager.noResults')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts?.map((product) => (
          <Card key={product.id}>
            <CardContent className="pt-6 space-y-4">
              {editingId === product.id ? (
                <ProductForm
                  product={product}
                  onSave={(updated) => updateMutation.mutate({ ...updated, id: product.id })}
                  onCancel={() => setEditingId(null)}
                  isPending={updateMutation.isPending}
                />
              ) : (
                <>
                  <img src={product.image_url} alt="" className="w-full h-48 object-cover rounded" />
                  <div className="space-y-2">
                    <p><strong>EN:</strong> {product.name_en}</p>
                    <p><strong>AR:</strong> {product.name_ar}</p>
                    {product.badge_en && <p><strong>{t('productsManager.badge')}:</strong> {product.badge_en} / {product.badge_ar}</p>}
                    <p><strong>{t('productsManager.order')}:</strong> {product.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(product.id)} variant="outline" size="sm">{t('productsManager.edit')}</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ product, onSave, onCancel, isPending }: any) => {
  const { t } = useLanguage();
  const [nameEn, setNameEn] = useState(product?.name_en || '');
  const [nameAr, setNameAr] = useState(product?.name_ar || '');
  const [descEn, setDescEn] = useState(product?.description_en || '');
  const [descAr, setDescAr] = useState(product?.description_ar || '');
  const [badgeEn, setBadgeEn] = useState(product?.badge_en || '');
  const [badgeAr, setBadgeAr] = useState(product?.badge_ar || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [order, setOrder] = useState(product?.display_order || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    try {
      const validated = productSchema.parse({
        name_en: nameEn,
        name_ar: nameAr,
        description_en: descEn,
        description_ar: descAr,
        badge_en: badgeEn || null,
        badge_ar: badgeAr || null,
        image_url: imageUrl,
        display_order: order,
      });
      setErrors({});
      onSave(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix validation errors');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('productsManager.imageUrl')}</Label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder={t('productsManager.imageUrlPlaceholder')} />
        {errors.image_url && <p className="text-sm text-destructive">{errors.image_url}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('productsManager.nameEn')}</Label>
          <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t('productsManager.nameEnPlaceholder')} />
          {errors.name_en && <p className="text-sm text-destructive">{errors.name_en}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('productsManager.nameAr')}</Label>
          <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder={t('productsManager.nameArPlaceholder')} dir="rtl" />
          {errors.name_ar && <p className="text-sm text-destructive">{errors.name_ar}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('productsManager.descEn')}</Label>
          <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder={t('productsManager.descEnPlaceholder')} />
          {errors.description_en && <p className="text-sm text-destructive">{errors.description_en}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('productsManager.descAr')}</Label>
          <Input value={descAr} onChange={(e) => setDescAr(e.target.value)} placeholder={t('productsManager.descArPlaceholder')} dir="rtl" />
          {errors.description_ar && <p className="text-sm text-destructive">{errors.description_ar}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('productsManager.category')}</Label>
        <Select 
          value={badgeEn} 
          onValueChange={(value) => {
            setBadgeEn(value);
            const category = CATEGORIES.find(c => c.en === value);
            if (category) setBadgeAr(category.ar);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('productsManager.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.en} value={category.en}>
                {category.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{t('productsManager.displayOrder')}</Label>
        <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isPending}
          size="sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('productsManager.save')}
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">{t('productsManager.cancel')}</Button>
      </div>
    </div>
  );
};
