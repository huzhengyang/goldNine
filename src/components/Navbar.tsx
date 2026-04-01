'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Newspaper, User, LogIn } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary-dark text-white h-[60px] flex items-center justify-between px-4 md:px-8 shadow-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-lg">🎱</span>
        </div>
        <span className="font-semibold text-lg hidden sm:inline">GoldNine</span>
      </Link>

      {/* 右侧按钮 */}
      <div className="flex items-center gap-2">
        {/* 新闻 */}
        <Link
          href="/news"
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="新闻资讯"
        >
          <Newspaper size={20} />
        </Link>

        {/* 搜索 */}
        <button
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="搜索"
        >
          <span className="text-lg">🔍</span>
        </button>

        {/* 用户 */}
        {isLoggedIn && user ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:bg-white/10 rounded-full px-2 py-1 transition-colors"
            title="个人中心"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="hidden sm:inline text-sm">{user.nickname}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
            title="登录"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline text-sm">登录</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
