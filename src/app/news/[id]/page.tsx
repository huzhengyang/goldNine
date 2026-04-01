'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MessageCircle,
  ThumbsUp,
  Eye,
  Sparkles,
  Send,
} from 'lucide-react';
import { News, Comment } from '@/types';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showAISummary, setShowAISummary] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
    fetchComments();
  }, [params.id]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockNews: News = {
        _id: params.id as string,
        title: '赵心童夺冠创历史！中国选手首次问鼎世锦赛',
        summary: '2026年4月1日，斯诺克世锦赛决赛落幕...',
        content: `
          <p>2026年4月1日，斯诺克世锦赛决赛在谢菲尔德克鲁斯堡剧院落下帷幕。中国选手赵心童在这场备受瞩目的决赛中，以13:11的比分击败了世界排名第三的对手，成为中国台球历史上首位世锦赛冠军。</p>
          
          <h2>决赛精彩回顾</h2>
          <p>决赛采用35局18胜制，分四个阶段进行。比赛一开始，赵心童就展现出了强劲的实力，第一阶段结束时以5:3领先。第二阶段，对手顽强追赶，将比分追至8:8平。</p>
          
          <p>关键时刻，赵心童展现出了超强的心理素质。在第三阶段，他打出两杆破百，再次取得领先优势。第四阶段，双方你来我往，比分交替上升。最终，赵心童在关键的第24局中，以一杆精彩的清台锁定胜局。</p>
          
          <h2>历史性突破</h2>
          <p>这次夺冠不仅打破了欧美选手对世锦赛冠军的垄断，也标志着中国台球运动进入了一个新的时代。赵心童的胜利，将激励更多的中国年轻选手投身于这项运动。</p>
          
          <p>赛后，赵心童激动地表示："这是我一直以来的梦想，能够在世锦赛上夺冠，对我来说意义非凡。感谢所有支持我的人，这个冠军属于中国台球！"</p>
          
          <h2>职业生涯新高</h2>
          <p>随着这次夺冠，赵心童的世界排名将从第5位上升至第2位，创下职业生涯新高。同时，他也成为了继丁俊晖之后，第二位登顶世界第一的中国选手的有力竞争者。</p>
          
          <p>这次世锦赛的成功，也为中国台球的发展注入了强心剂。相信在不久的将来，我们会看到更多中国选手在世界舞台上绽放光芒。</p>
        `,
        cover_image: 'https://picsum.photos/800/600?random=10',
        images: [
          'https://picsum.photos/800/600?random=11',
          'https://picsum.photos/800/600?random=12',
          'https://picsum.photos/800/600?random=13',
        ],
        category: 'news',
        tags: ['赵心童', '世锦赛', '中国台球', '斯诺克'],
        source: '台球HQ',
        author: '张三',
        view_count: 12000,
        like_count: 328,
        comment_count: 156,
        is_top: true,
        is_ai_generated: false,
        ai_summary: '• 赵心童在2026年斯诺克世锦赛中以13:11击败对手\n• 这是中国选手首次问鼎世锦赛冠军\n• 决赛中打出2杆破百，职业生涯最佳\n• 赵心童现世界排名第5，创造中国台球历史',
        ai_keywords: ['赵心童', '世锦赛', '中国台球', '斯诺克', '冠军'],
        created_at: '2026-04-01T12:00:00Z',
        updated_at: '2026-04-01T12:00:00Z',
      };

      setNews(mockNews);
    } catch (error) {
      console.error('获取新闻详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // 模拟API调用
      const mockComments: Comment[] = [
        {
          _id: '1',
          target_type: 'news',
          target_id: params.id as string,
          user_id: 'user1',
          user_name: '台球迷小王',
          user_avatar: 'https://picsum.photos/100/100?random=20',
          content: '恭喜赵心童！中国台球的骄傲！🎉🎉🎉',
          like_count: 128,
          created_at: '2026-04-01T13:00:00Z',
        },
        {
          _id: '2',
          target_type: 'news',
          target_id: params.id as string,
          user_id: 'user2',
          user_name: '斯诺克爱好者',
          user_avatar: 'https://picsum.photos/100/100?random=21',
          content: '这场比赛看得太紧张了，赵心童的心理素质真的太强了！',
          like_count: 95,
          created_at: '2026-04-01T14:30:00Z',
        },
        {
          _id: '3',
          target_type: 'news',
          target_id: params.id as string,
          user_id: 'user3',
          user_name: '球房老板',
          user_avatar: 'https://picsum.photos/100/100?random=22',
          content: '希望这次夺冠能带动更多人参与台球运动！',
          like_count: 76,
          created_at: '2026-04-01T15:00:00Z',
        },
      ];

      setComments(mockComments);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
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

  const handleLike = () => {
    setLiked(!liked);
    // TODO: 调用API
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    // TODO: 调用API
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    // TODO: 提交评论
    setCommentText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">新闻不存在</p>
          <Link href="/news" className="text-green-700 hover:underline mt-2 inline-block">
            返回新闻列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLike}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  liked ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleFavorite}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  favorited ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                <Star className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 文章头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {news.is_top && (
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              置顶
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span>来源：{news.source}</span>
            <span>•</span>
            <span>{formatDate(news.created_at)}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(news.view_count)}阅读</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>作者：{news.author}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{news.like_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{news.comment_count}</span>
            </div>
          </div>
        </div>

        {/* AI摘要 */}
        {news.ai_summary && showAISummary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">AI智能摘要</span>
              </div>
              <button
                onClick={() => setShowAISummary(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                收起
              </button>
            </div>
            <div className="space-y-2">
              {news.ai_summary.split('\n').map((point, index) => (
                <div key={index} className="text-gray-700 text-sm">
                  {point}
                </div>
              ))}
            </div>
            {news.ai_keywords && (
              <div className="flex flex-wrap gap-2 mt-4">
                {news.ai_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 封面图 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img src={news.cover_image} alt={news.title} className="w-full h-auto" />
        </div>

        {/* 正文内容 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        {/* 相关图片 */}
        {news.images && news.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">相关图片</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {news.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {news.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>评论 ({comments.length})</span>
            </h3>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <img
                  src={comment.user_avatar}
                  alt={comment.user_name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.user_name}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.like_count}</span>
                    </button>
                    <button className="hover:text-green-700">回复</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 发表评论 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="发表评论..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>发送</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关推荐 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">相关推荐</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                href={`/news/${i}`}
                className="flex space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={`https://picsum.photos/200/150?random=${i + 20}`}
                  alt="推荐新闻"
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-green-700 transition-colors">
                    赵心童世锦赛夺冠之路：从资格赛到决赛
                  </h4>
                  <p className="text-sm text-gray-500">{formatDate('2026-04-01T10:00:00Z')} • 8900浏览</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏（移动端） */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <input
            type="text"
            placeholder="写评论..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex items-center space-x-4 ml-4">
            <button onClick={handleLike} className="flex flex-col items-center">
              <Heart className={`w-5 h-5 ${liked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              <span className="text-xs text-gray-600 mt-1">{news.like_count}</span>
            </button>
            <button onClick={handleFavorite} className="flex flex-col items-center">
              <Star className={`w-5 h-5 ${favorited ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
              <span className="text-xs text-gray-600 mt-1">收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function handleShare() {
    // TODO: 实现分享功能
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: window.location.href,
      });
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  }
}
