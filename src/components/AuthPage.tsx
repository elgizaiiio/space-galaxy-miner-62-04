
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم تسجيل الدخول بنجاح!",
          description: "مرحباً بك في Space App",
        });
        onAuthSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              username: formData.username,
              telegram_id: Math.floor(Math.random() * 1000000000)
            }
          }
        });

        if (error) {
          toast({
            title: "خطأ في إنشاء الحساب",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم إنشاء الحساب بنجاح!",
          description: "يمكنك الآن تسجيل الدخول",
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden">
        <CardHeader className="pb-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </CardTitle>
            <p className="text-gray-300 mt-2">
              {isLogin ? 'أدخل بياناتك للوصول إلى حسابك' : 'أنشئ حساباً جديداً للبدء'}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">الاسم الأول</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="أحمد"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">الاسم الأخير</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="محمد"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                      placeholder="ahmed_space"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : isLogin ? (
                <LogIn className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب؟ سجل الدخول'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
