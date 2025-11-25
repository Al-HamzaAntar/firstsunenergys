import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { UserPlus, Key, Eye, EyeOff, Users, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

export const UserManagement = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const createUserSchema = z.object({
    email: z.string().email({ message: t('validation.invalidEmail') }),
    password: z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password must be less than 128 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsNoMatch'),
    path: ["confirmPassword"],
  });

  const changePasswordSchema = z.object({
    email: z.string().email({ message: t('validation.invalidEmail') }),
    newPassword: z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password must be less than 128 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('validation.passwordsNoMatch'),
    path: ["confirmPassword"],
  });
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirmPassword, setCreateConfirmPassword] = useState('');
  const [createRole] = useState<'editor'>('editor');
  const [changeEmail, setChangeEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    // Only fetch if we have a valid user session
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session available, skipping user fetch');
        setIsLoadingUsers(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-list-users');

      if (error) {
        // Handle 401 errors silently - user is likely being signed out
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          console.log('Session expired, user will be redirected');
          setIsLoadingUsers(false);
          return;
        }
        throw error;
      }

      setUsers(data.users || []);
    } catch (error: any) {
      // Only show error toast if it's not an auth error
      if (!error.message?.includes('401') && !error.message?.includes('Unauthorized')) {
        toast.error(error.message || t('toast.users.loadError'));
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session available');
        return;
      }

      const { error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) {
        // Handle auth errors silently
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          console.log('Session expired during user deletion');
          return;
        }
        throw error;
      }

      toast.success(t('toast.users.deleteSuccess'));
      fetchUsers();
    } catch (error: any) {
      if (!error.message?.includes('401') && !error.message?.includes('Unauthorized')) {
        toast.error(error.message || t('toast.users.deleteError'));
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      createUserSchema.parse({
        email: createEmail,
        password: createPassword,
        confirmPassword: createConfirmPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session available');
        setIsCreating(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { email: createEmail, password: createPassword, role: createRole }
      });

      if (error) {
        // Handle auth errors silently
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          console.log('Session expired during user creation');
          setIsCreating(false);
          return;
        }
        throw error;
      }

      toast.success(t('toast.users.createSuccess'));
      setCreateEmail('');
      setCreatePassword('');
      setCreateConfirmPassword('');
      
      fetchUsers();
    } catch (error: any) {
      if (!error.message?.includes('401') && !error.message?.includes('Unauthorized')) {
        toast.error(error.message || t('toast.users.createError'));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      changePasswordSchema.parse({
        email: changeEmail,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsChangingPassword(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session available');
        setIsChangingPassword(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-change-password', {
        body: { email: changeEmail, newPassword: newPassword }
      });

      if (error) {
        // Handle auth errors silently
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          console.log('Session expired during password change');
          setIsChangingPassword(false);
          return;
        }
        throw error;
      }

      toast.success(t('toast.users.passwordChangeSuccess'));
      setChangeEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (!error.message?.includes('401') && !error.message?.includes('Unauthorized')) {
        toast.error(error.message || t('toast.users.passwordChangeError'));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('dashboard.users.allUsers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="text-center py-8">{t('dashboard.loading')}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.users.email')}</TableHead>
                    <TableHead>{t('dashboard.users.roles')}</TableHead>
                    <TableHead>{t('dashboard.users.createdAt')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.users.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {t('overview.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>
                          {u.roles.length > 0 ? (
                            <div className="flex gap-1">
                              {u.roles.map((role) => (
                                <span key={role} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                  {role}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={u.id === user?.id}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {u.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t('userManagement.createUser')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">{t('userManagement.email')}</Label>
              <Input
                id="create-email"
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">{t('userManagement.password')}</Label>
              <div className="relative">
                <Input
                  id="create-password"
                  type={showCreatePassword ? "text" : "password"}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword(!showCreatePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-confirm-password">{t('userManagement.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="create-confirm-password"
                  type={showCreateConfirmPassword ? "text" : "password"}
                  value={createConfirmPassword}
                  onChange={(e) => setCreateConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCreateConfirmPassword(!showCreateConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCreateConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? t('userManagement.creating') : t('userManagement.createUser')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            {t('userManagement.changePassword')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="change-email">{t('userManagement.userEmail')}</Label>
              <Input
                id="change-email"
                type="email"
                value={changeEmail}
                onChange={(e) => setChangeEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('userManagement.newPassword')}</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">{t('userManagement.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? t('userManagement.changing') : t('userManagement.changePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
