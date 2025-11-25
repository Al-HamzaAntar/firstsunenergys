import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const gallerySchema = z.object({
  title_key: z.string().trim().min(1, "Title key is required").max(100, "Title key must be less than 100 characters").regex(/^[a-zA-Z0-9._-]+$/, "Title key can only contain letters, numbers, dots, hyphens and underscores"),
  description_key: z.string().trim().min(1, "Description key is required").max(500, "Description key must be less than 500 characters").regex(/^[a-zA-Z0-9._-]+$/, "Description key can only contain letters, numbers, dots, hyphens and underscores"),
  image_url: z.string().trim().url("Must be a valid URL").max(2000, "URL must be less than 2000 characters"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category must be less than 100 characters"),
  display_order: z.number().int().min(0, "Order must be a positive number"),
});

export const GalleryManager = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['gallery_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_products')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase
        .from('gallery_products')
        .update(product)
        .eq('id', product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_products'] });
      toast.success('Product updated');
      setEditingId(null);
    },
    onError: () => toast.error('Failed to update product'),
  });

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase
        .from('gallery_products')
        .insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_products'] });
      toast.success('Product created');
      setShowNew(false);
    },
    onError: () => toast.error('Failed to create product'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowNew(true)} disabled={showNew}>
        <Plus className="w-4 h-4 mr-2" />
        {t('galleryManager.addItem')}
      </Button>

      {showNew && (
        <ProductForm
          onSave={(product) => createMutation.mutate(product)}
          onCancel={() => setShowNew(false)}
          isPending={createMutation.isPending}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
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
                    <p><strong>{t('galleryManager.titleKey')}:</strong> {product.title_key}</p>
                    <p><strong>{t('galleryManager.descKey')}:</strong> {product.description_key}</p>
                    <p><strong>{t('galleryManager.category')}:</strong> {product.category}</p>
                    <p><strong>{t('galleryManager.order')}:</strong> {product.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(product.id)} variant="outline" size="sm">{t('galleryManager.edit')}</Button>
                    <Button onClick={() => deleteMutation.mutate(product.id)} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProductForm = ({ product, onSave, onCancel, isPending }: any) => {
  const { t } = useLanguage();
  const [titleKey, setTitleKey] = useState(product?.title_key || '');
  const [descKey, setDescKey] = useState(product?.description_key || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [category, setCategory] = useState(product?.category || '');
  const [order, setOrder] = useState(product?.display_order || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    try {
      const validated = gallerySchema.parse({
        title_key: titleKey,
        description_key: descKey,
        image_url: imageUrl,
        category,
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
        <Label>{t('galleryManager.imageUrl')}</Label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        {errors.image_url && <p className="text-sm text-destructive">{errors.image_url}</p>}
      </div>
      <div className="space-y-2">
        <Label>{t('galleryManager.titleKey')}</Label>
        <Input value={titleKey} onChange={(e) => setTitleKey(e.target.value)} placeholder="e.g., products.item1.title" />
        {errors.title_key && <p className="text-sm text-destructive">{errors.title_key}</p>}
      </div>
      <div className="space-y-2">
        <Label>{t('galleryManager.descKey')}</Label>
        <Input value={descKey} onChange={(e) => setDescKey(e.target.value)} placeholder="e.g., products.item1.description" />
        {errors.description_key && <p className="text-sm text-destructive">{errors.description_key}</p>}
      </div>
      <div className="space-y-2">
        <Label>{t('galleryManager.category')}</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </div>
      <div className="space-y-2">
        <Label>{t('galleryManager.order')}</Label>
        <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        {errors.display_order && <p className="text-sm text-destructive">{errors.display_order}</p>}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isPending}
          size="sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('galleryManager.save')}
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">{t('galleryManager.cancel')}</Button>
      </div>
    </div>
  );
};
