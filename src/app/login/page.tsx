'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Phone, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    // TODO: 调用发送验证码API
    // 这里暂时模拟发送
    console.log('发送验证码到:', phone);
    
    // 开始倒计时
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setError('');
  };

  // 登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          phone,
          code
        })
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功
        login(data.user);
        router.push('/');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GoldNine</h1>
          <p className="text-white/80">台球爱好者的专业平台</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">登录</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* 手机号输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* 验证码输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    countdown > 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? '登录中...' : '登录'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* 底部提示 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              首次登录将自动注册账号
            </p>
          </div>

          {/* 返回首页 */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-primary hover:text-primary-dark text-sm font-medium">
              返回首页
            </Link>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>登录即表示同意《用户协议》和《隐私政策》</p>
        </div>
      </div>
    </div>
  );
}
