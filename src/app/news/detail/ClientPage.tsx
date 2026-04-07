'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '@/lib/cloudbase';

interface News {
  _id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  keywords: string[];
  source: string;
  sourceUrl?: string;
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
  isOriginal: boolean;
  isAIGenerated: boolean;
}

export default function NewsDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const newsId = searchParams.get('id');
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) {
        setError('缺少新闻ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 匿名登录
        const auth = app.auth();
        await auth.signInAnonymously();

        // 获取新闻详情
        const db = app.database();
        const result = await db.collection('news').doc(newsId).get();

        if (result.data && result.data.length > 0) {
          setNews(result.data[0] as News);
        } else {
          setError('新闻不存在');
        }
      } catch (err: any) {
        console.error('获取新闻详情失败:', err);
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      competition: '赛事',
      tutorial: '技巧',
      equipment: '装备'
    };
    return map[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      competition: 'bg-red-500',
      tutorial: 'bg-blue-500',
      equipment: 'bg-green-500'
    };
    return map[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
          <p className="text-gray-600 mb-6">{error || '新闻不存在'}</p>
          <Link
            href="/news"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回新闻列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/news" className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </Link>
            <Link href="/" className="text-xl font-bold text-blue-600">
              GoldNine台球
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Category Badge */}
          <div className="p-6 pb-0">
            <span className={`inline-block px-3 py-1 text-sm font-medium text-white rounded-full ${getCategoryColor(news.category)}`}>
              {getCategoryLabel(news.category)}
            </span>
          </div>

          {/* Title */}
          <div className="p-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {news.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="px-6 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(news.createdAt)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {news.viewCount} 阅读
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {news.likeCount} 喜欢
              </span>
              <span>来源：{news.source}</span>
              {news.isOriginal && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  原创
                </span>
              )}
              {news.isAIGenerated && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  AI辅助
                </span>
              )}
            </div>
          </div>

          {/* Keywords */}
          {news.keywords && news.keywords.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {news.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                {news.summary}
              </p>
              {news.content && (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {news.content}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  点赞
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
              </div>
              {news.sourceUrl && (
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  查看原文
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Back to List */}
        <div className="mt-6 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回新闻列表
          </Link>
        </div>
      </main>
    </div>
  );
}
