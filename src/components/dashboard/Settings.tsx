import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const changeMyPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: t('validation.passwordMinLength') }),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('validation.passwordsNoMatch'),
    path: ["confirmPassword"],
  });
  const [myNewPassword, setMyNewPassword] = useState('');
  const [myConfirmPassword, setMyConfirmPassword] = useState('');
  const [isChangingMyPassword, setIsChangingMyPassword] = useState(false);
  const [showMyNewPassword, setShowMyNewPassword] = useState(false);
  const [showMyConfirmPassword, setShowMyConfirmPassword] = useState(false);

  const handleChangeMyPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      changeMyPasswordSchema.parse({
        newPassword: myNewPassword,
        confirmPassword: myConfirmPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (!user?.email) {
      toast.error(t('toast.settings.userEmailNotFound'));
      return;
    }

    setIsChangingMyPassword(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error(t('toast.settings.notAuthenticated'));
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-change-password', {
        body: { email: user.email, newPassword: myNewPassword }
      });

      if (error) throw error;

      toast.success(t('toast.settings.passwordChangeSuccess'));
      setMyNewPassword('');
      setMyConfirmPassword('');
      
      // Sign out after changing own password since the session is now invalid
      await signOut();
    } catch (error: any) {
      toast.error(error.message || t('toast.settings.passwordChangeError'));
    } finally {
      setIsChangingMyPassword(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {t('dashboard.settings.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.settings.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangeMyPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="myNewPassword">{t('dashboard.settings.newPassword')}</Label>
            <div className="relative">
              <Input
                id="myNewPassword"
                type={showMyNewPassword ? "text" : "password"}
                value={myNewPassword}
                onChange={(e) => setMyNewPassword(e.target.value)}
                placeholder={t('dashboard.settings.newPassword')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowMyNewPassword(!showMyNewPassword)}
              >
                {showMyNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="myConfirmPassword">{t('dashboard.settings.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="myConfirmPassword"
                type={showMyConfirmPassword ? "text" : "password"}
                value={myConfirmPassword}
                onChange={(e) => setMyConfirmPassword(e.target.value)}
                placeholder={t('dashboard.settings.confirmPassword')}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowMyConfirmPassword(!showMyConfirmPassword)}
              >
                {showMyConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isChangingMyPassword}>
            <Lock className="w-4 h-4 mr-2" />
            {isChangingMyPassword ? `${t('dashboard.settings.changePasswordButton')}...` : t('dashboard.settings.changePasswordButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
