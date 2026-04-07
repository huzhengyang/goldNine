'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import {
  Newspaper,
  Trophy,
  Brain,
  Building2,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";
import { ensureAuth, newsCollection } from '@/lib/cloudbase';

// 新闻数据类型
interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  source?: string;
  viewCount?: number;
  createdAt?: any;
}

// 格式化时间
function formatTime(date: any): string {
  if (!date) return '刚刚';
  
  const target = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  
  return target.toLocaleDateString('zh-CN');
}

// 格式化浏览量
function formatViewCount(count?: number): string {
  if (!count) return '0';
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export default function Home() {
  const [hotNews, setHotNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        // 确保已登录
        await ensureAuth();
        
        // 查询新闻
        const result = await newsCollection
          .where({
            status: 'published'
          })
          .orderBy('createdAt', 'desc')
          .limit(4)
          .get();
        
        console.log('新闻数据:', result.data);
        setHotNews(result.data || []);
        setError(null);
      } catch (err: any) {
        console.error('加载新闻失败:', err);
        setError(err.message);
        // 使用模拟数据作为后备
        setHotNews([
          {
            _id: '1',
            title: '赵心童2026世锦赛夺冠创历史',
            summary: '中国选手首次夺得斯诺克世锦赛冠军',
            viewCount: 12580,
            createdAt: new Date(Date.now() - 3600000)
          },
          {
            _id: '2',
            title: '台球握杆技巧详解',
            summary: '正确的握杆姿势是打好台球的基础',
            viewCount: 8650,
            createdAt: new Date(Date.now() - 7200000)
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-[60px]">
        <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-green-600 to-green-800 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              🎱 AI动作分析，让训练更智能
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              上传打球视频，30秒获得专业训练报告
            </p>
            <div className="flex gap-4">
              <Link
                href="/analysis"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                立即体验
              </Link>
              <Link
                href="/news"
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 功能导航 */}
      <section className="py-8 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <FeatureCard
              icon={<Newspaper className="w-6 h-6" />}
              title="新闻资讯"
              description="热门台球新闻"
              href="/news"
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI动作分析"
              description="智能训练助手"
              href="/analysis"
              color="bg-purple-50 text-purple-600"
            />
            <FeatureCard
              icon={<Building2 className="w-6 h-6" />}
              title="球房预订"
              description="附近优质球房"
              href="/venues"
              color="bg-green-50 text-green-600"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="赛事报名"
              description="精彩赛事等你"
              href="/events"
              color="bg-orange-50 text-orange-600"
            />
            <FeatureCard
              icon={<GraduationCap className="w-6 h-6" />}
              title="助教预约"
              description="专业教练指导"
              href="/coaches"
              color="bg-pink-50 text-pink-600"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="商城购物"
              description="专业台球装备"
              href="/shop"
              color="bg-indigo-50 text-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* 热门新闻 */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">热门新闻</h2>
            <Link href="/news" className="text-green-600 hover:text-green-700 text-sm font-medium">
              查看更多 →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="h-[180px] bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ {error}（使用缓存数据）
              </p>
            </div>
          ) : hotNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotNews.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="h-[180px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🎱
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{formatTime(news.createdAt)}</span>
                      <span>浏览 {formatViewCount(news.viewCount)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📰</div>
              <p className="text-gray-600 mb-4">暂无新闻数据</p>
              <p className="text-sm text-gray-500">
                系统会自动抓取台球新闻，请稍后再来查看
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 底部信息 */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-2xl">🎱</span>
            <span className="ml-2 font-bold text-lg">GoldNine Kiro</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 GoldNine.cn 版权所有
          </p>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] flex items-center justify-around px-2 z-50">
        <MobileNavItem icon="🏠" label="首页" href="/" />
        <MobileNavItem icon="📰" label="新闻" href="/news" />
        <MobileNavItem icon="🎯" label="AI分析" href="/analysis" />
        <MobileNavItem icon="🏢" label="球房" href="/venues" />
        <MobileNavItem icon="👤" label="我的" href="/profile" />
      </nav>
    </main>
  );
}

// 功能卡片组件
function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

// 移动端导航项组件
function MobileNavItem({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center py-1 text-gray-600 hover:text-green-600 transition-colors"
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
