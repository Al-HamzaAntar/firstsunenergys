import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { z } from 'zod';

const translationSchema = z.object({
  key: z.string().trim().min(1, "Key is required").max(100, "Key must be less than 100 characters").regex(/^[a-zA-Z0-9._-]+$/, "Key can only contain letters, numbers, dots, hyphens and underscores"),
  ar: z.string().trim().min(1, "Arabic text is required").max(5000, "Text must be less than 5000 characters"),
  en: z.string().trim().min(1, "English text is required").max(5000, "Text must be less than 5000 characters"),
});

export const TranslationsManager = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newAr, setNewAr] = useState('');
  const [newEn, setNewEn] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('key');
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, key, ar, en }: { id: string; key: string; ar: string; en: string }) => {
      const { error } = await supabase
        .from('translations')
        .update({ key, ar, en })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('Translation updated');
      setEditingId(null);
    },
    onError: () => toast.error('Failed to update translation'),
  });

  const createMutation = useMutation({
    mutationFn: async ({ key, ar, en }: { key: string; ar: string; en: string }) => {
      // Validate input
      translationSchema.parse({ key, ar, en });
      
      // Insert the validated data
      const { error } = await supabase
        .from('translations')
        .insert({ key, ar, en });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('Translation created');
      setNewKey('');
      setNewAr('');
      setNewEn('');
      setErrors({});
    },
    onError: (error: any) => {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix validation errors');
      } else {
        toast.error('Failed to create translation');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('Translation deleted');
    },
    onError: () => toast.error('Failed to delete translation'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Translation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., hero.title"
              />
              {errors.key && <p className="text-sm text-destructive">{errors.key}</p>}
            </div>
            <div className="space-y-2">
              <Label>Arabic</Label>
              <Textarea
                value={newAr}
                onChange={(e) => setNewAr(e.target.value)}
                placeholder="النص بالعربية"
                className="min-h-[80px]"
              />
              {errors.ar && <p className="text-sm text-destructive">{errors.ar}</p>}
            </div>
            <div className="space-y-2">
              <Label>English</Label>
              <Textarea
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                placeholder="Text in English"
                className="min-h-[80px]"
              />
              {errors.en && <p className="text-sm text-destructive">{errors.en}</p>}
            </div>
          </div>
          <Button
            onClick={() => createMutation.mutate({ key: newKey, ar: newAr, en: newEn })}
            disabled={!newKey || !newAr || !newEn || createMutation.isPending}
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Translation
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {translations?.map((trans) => (
          <Card key={trans.id}>
            <CardContent className="pt-6">
              {editingId === trans.id ? (
                <EditForm
                  translation={trans}
                  onSave={(key, ar, en) => updateMutation.mutate({ id: trans.id, key, ar, en })}
                  onCancel={() => setEditingId(null)}
                  isPending={updateMutation.isPending}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Key</Label>
                      <p className="font-mono text-sm mt-1">{trans.key}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Arabic</Label>
                      <p className="mt-1">{trans.ar}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">English</Label>
                      <p className="mt-1">{trans.en}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(trans.id)} variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(trans.id)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EditForm = ({
  translation,
  onSave,
  onCancel,
  isPending,
}: {
  translation: any;
  onSave: (key: string, ar: string, en: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) => {
  const [key, setKey] = useState(translation.key);
  const [ar, setAr] = useState(translation.ar);
  const [en, setEn] = useState(translation.en);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    try {
      translationSchema.parse({ key, ar, en });
      setErrors({});
      onSave(key, ar, en);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} />
          {errors.key && <p className="text-sm text-destructive">{errors.key}</p>}
        </div>
        <div className="space-y-2">
          <Label>Arabic</Label>
          <Textarea value={ar} onChange={(e) => setAr(e.target.value)} className="min-h-[80px]" />
          {errors.ar && <p className="text-sm text-destructive">{errors.ar}</p>}
        </div>
        <div className="space-y-2">
          <Label>English</Label>
          <Textarea value={en} onChange={(e) => setEn(e.target.value)} className="min-h-[80px]" />
          {errors.en && <p className="text-sm text-destructive">{errors.en}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isPending} size="sm">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
};
