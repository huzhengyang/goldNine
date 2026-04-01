'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, Eye, MessageCircle, Flame, TrendingUp } from 'lucide-react';
import { News } from '@/types';

const categories = [
  { key: 'all', label: '全部' },
  { key: 'news', label: '热门新闻' },
  { key: 'event', label: '赛事' },
  { key: 'skill', label: '技巧' },
  { key: 'video', label: '视频' },
];

const sortOptions = [
  { key: 'latest', label: '最新' },
  { key: 'hottest', label: '最热' },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, activeSort]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockNews: News[] = [
        {
          _id: '1',
          title: '赵心童夺冠创历史！中国选手首次问鼎世锦赛',
          summary: '2026年4月1日，斯诺克世锦赛决赛落幕，中国选手赵心童以13:11击败对手，成为首位夺得世锦赛冠军的中国选手，创造了中国台球的历史。',
          content: '',
          cover_image: 'https://picsum.photos/800/600?random=1',
          category: 'news',
          tags: ['赵心童', '世锦赛', '中国台球'],
          source: '台球HQ',
          author: '张三',
          view_count: 12000,
          like_count: 328,
          comment_count: 156,
          is_top: true,
          is_ai_generated: false,
          created_at: '2026-04-01T12:00:00Z',
          updated_at: '2026-04-01T12:00:00Z',
        },
        {
          _id: '2',
          title: '新手必看！5个台球入门基础动作详解',
          summary: '台球是一项需要技巧和耐心的运动，正确的姿势和动作是打好台球的基础。本文将详细介绍握杆、站位、瞄准等5个基础动作。',
          content: '',
          cover_image: 'https://picsum.photos/800/600?random=2',
          category: 'skill',
          tags: ['台球技巧', '新手入门'],
          source: '台球HQ',
          author: '李四',
          view_count: 8560,
          like_count: 245,
          comment_count: 89,
          is_top: false,
          is_ai_generated: false,
          created_at: '2026-03-31T10:00:00Z',
          updated_at: '2026-03-31T10:00:00Z',
        },
        {
          _id: '3',
          title: '台球新手入门！从握杆到击球的5个关键步骤',
          summary: '对于台球新手来说，掌握正确的握杆姿势和击球技巧至关重要。本视频将详细讲解从握杆到击球的完整流程。',
          content: '',
          cover_image: 'https://picsum.photos/800/600?random=3',
          video_url: 'https://example.com/video.mp4',
          category: 'video',
          tags: ['教学视频', '新手入门'],
          source: 'GoldNine',
          author: '王教练',
          view_count: 6780,
          like_count: 198,
          comment_count: 67,
          is_top: false,
          is_ai_generated: false,
          created_at: '2026-03-30T14:00:00Z',
          updated_at: '2026-03-30T14:00:00Z',
        },
        {
          _id: '4',
          title: '2026春季城市台球联赛即将开赛',
          summary: '由金桌球俱乐部主办的2026春季城市台球联赛将于4月15日正式开赛，奖金池高达5000元，欢迎各位台球爱好者报名参加。',
          content: '',
          cover_image: 'https://picsum.photos/800/600?random=4',
          category: 'event',
          tags: ['赛事', '台球联赛'],
          source: 'GoldNine',
          author: '赛事组',
          view_count: 4320,
          like_count: 156,
          comment_count: 45,
          is_top: false,
          is_ai_generated: false,
          created_at: '2026-03-29T09:00:00Z',
          updated_at: '2026-03-29T09:00:00Z',
        },
      ];

      // 根据分类筛选
      let filtered = mockNews;
      if (activeCategory !== 'all') {
        filtered = mockNews.filter((news) => news.category === activeCategory);
      }

      // 根据排序方式排序
      if (activeSort === 'hottest') {
        filtered.sort((a, b) => b.view_count - a.view_count);
      } else {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setNewsList(filtered);
    } catch (error) {
      console.error('获取新闻失败:', error);
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
                      src={news.cover_image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    {news.is_top && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>置顶</span>
                      </div>
                    )}
                    {news.category === 'video' && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        视频
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
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{formatDate(news.created_at)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(news.view_count)}浏览</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{news.comment_count}</span>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {news.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
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
