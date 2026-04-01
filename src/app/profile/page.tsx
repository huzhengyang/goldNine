'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  User, 
  Phone, 
  MapPin, 
  Award, 
  Star, 
  ChevronRight,
  Settings,
  LogOut,
  Edit
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部用户信息 */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white pb-8">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.nickname}</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Award className="w-4 h-4" />
                <span>{user.level || '青铜'} · {user.points || 0}积分</span>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Tab切换 */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="flex">
            {[
              { id: 'info', label: '个人信息' },
              { id: 'stats', label: '我的战绩' },
              { id: 'orders', label: '我的订单' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab内容 */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              <InfoItem icon={<Phone className="w-5 h-5" />} label="手机号" value={user.phone || '未设置'} />
              <InfoItem icon={<MapPin className="w-5 h-5" />} label="城市" value={user.city || '未设置'} />
              <InfoItem icon={<User className="w-5 h-5" />} label="性别" value={user.gender || '未设置'} />
              <InfoItem icon={<Star className="w-5 h-5" />} label="个人简介" value={user.bio || '这个人很懒，什么都没写'} />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无战绩数据</p>
              <p className="text-sm mt-2">参加赛事后这里会显示你的战绩</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无订单数据</p>
              <p className="text-sm mt-2">预约课程或购买商品后这里会显示订单</p>
            </div>
          </div>
        )}

        {/* 快捷菜单 */}
        <div className="bg-white rounded-lg shadow-md mt-4 overflow-hidden">
          <MenuItem icon={<Award className="w-5 h-5" />} label="我的收藏" href="/favorites" />
          <MenuItem icon={<Star className="w-5 h-5" />} label="AI分析记录" href="/ai-analysis" />
          <MenuItem icon={<Settings className="w-5 h-5" />} label="设置" href="/settings" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 返回首页 */}
        <div className="text-center py-8">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

// 信息项组件
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

// 菜单项组件
function MenuItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Link>
  );
}
