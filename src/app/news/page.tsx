'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, Eye, MessageCircle, Flame, TrendingUp } from 'lucide-react';
import { ensureAuth, newsCollection } from '@/lib/cloudbase';

const categories = [
  { key: 'all', label: '全部' },
  { key: 'competition', label: '赛事' },
  { key: 'tutorial', label: '技巧' },
  { key: 'equipment', label: '装备' },
];

const sortOptions = [
  { key: 'latest', label: '最新' },
  { key: 'hottest', label: '最热' },
];

// 新闻数据类型
interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  category: string;
  keywords?: string[];
  source?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  status?: string;
  isAIGenerated?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, activeSort]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 确保已登录
      await ensureAuth();
      
      // 构建查询条件
      let query = newsCollection.where({
        status: 'published'
      });
      
      // 根据分类筛选
      if (activeCategory !== 'all') {
        query = newsCollection.where({
          status: 'published',
          category: activeCategory
        });
      }
      
      // 根据排序方式排序
      const orderBy = activeSort === 'hottest' ? 'viewCount' : 'createdAt';
      
      // 查询数据
      const result = await query
        .orderBy(orderBy, 'desc')
        .limit(20)
        .get();
      
      console.log('新闻数据:', result.data);
      setNewsList(result.data || []);
    } catch (error) {
      console.error('获取新闻失败:', error);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">新闻资讯</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索新闻..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 分类导航 */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-700 hover:text-green-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">排序：</span>
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveSort(option.key)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                  activeSort === option.key
                    ? 'text-green-700 font-medium'
                    : 'text-gray-600 hover:text-green-700'
                }`}
              >
                {option.key === 'latest' && <Clock className="w-4 h-4" />}
                {option.key === 'hottest' && <Flame className="w-4 h-4" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 新闻列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {newsList.map((news) => (
              <Link
                key={news._id}
                href={`/news/${news._id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* 图片 */}
                  <div className="relative sm:w-48 md:w-56 h-48 sm:h-auto flex-shrink-0">
                    <img
                      src={news.imageUrl || `https://picsum.photos/800/600?random=${news._id}`}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    {news.isAIGenerated && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-medium">
                        AI生成
                      </div>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-700 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {news.summary}
                    </p>

                    {/* 元信息 */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{news.source || 'GoldNine'}</span>
                      <span>•</span>
                      <span>{formatDate(news.createdAt)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(news.viewCount || 0)}浏览</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{news.commentCount || 0}</span>
                      </div>
                    </div>

                    {/* 标签 */}
                    {news.keywords && news.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {news.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {!loading && newsList.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors">
              加载更多
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && newsList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">暂无新闻</div>
            <p className="text-gray-500 text-sm">快去浏览其他分类吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
