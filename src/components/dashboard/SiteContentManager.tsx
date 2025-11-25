import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const MAX_JSON_SIZE = 50000; // 50KB limit for JSON content

export const SiteContentManager = ({ section }: { section: string }) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const { data: siteContent, isLoading } = useQuery({
    queryKey: ['site_content', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', section)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setContent(JSON.stringify(data.content, null, 2));
      }
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Validate JSON size
      if (content.length > MAX_JSON_SIZE) {
        throw new Error(`JSON content exceeds maximum size of ${MAX_JSON_SIZE / 1000}KB`);
      }

      // Validate JSON format
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        throw new Error('Invalid JSON format. Please check your syntax.');
      }

      // Basic validation that it's an object or array
      if (typeof parsedContent !== 'object' || parsedContent === null) {
        throw new Error('JSON must be an object or array');
      }

      if (siteContent) {
        const { error } = await supabase
          .from('site_content')
          .update({ content: parsedContent })
          .eq('section', section);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert({ section, content: parsedContent });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content', section] });
      toast.success('Content updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update content');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('section', section);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content', section] });
      toast.success('Content deleted');
      setContent('');
    },
    onError: () => toast.error('Failed to delete content'),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{section} {t('siteContentManager.sectionContent')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('siteContentManager.content')}</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {t('siteContentManager.save')}
          </Button>
          {siteContent && (
            <Button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              variant="destructive"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {t('siteContentManager.delete')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
