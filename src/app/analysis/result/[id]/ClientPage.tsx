'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Download,
  Calendar,
  User,
  Star,
  AlertCircle,
  Check,
  TrendingUp,
  Play,
} from 'lucide-react';
import { AIAnalysis } from '@/types';

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState(0);

  useEffect(() => {
    fetchAnalysisResult();
  }, [params.id]);

  const fetchAnalysisResult = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockAnalysis: AIAnalysis = {
        _id: params.id as string,
        user_id: 'user1',
        video_url: 'https://example.com/video.mp4',
        video_thumbnail: 'https://picsum.photos/800/600?random=30',
        analysis_type: 'comprehensive',
        score: 78,
        grip_score: 90,
        stance_score: 65,
        power_score: 75,
        rhythm_score: 85,
        highlights: [
          '握杆姿势标准，手肘位置稳定',
          '击球节奏控制良好',
          '身体协调性优秀',
        ],
        improvements: [
          '站位重心偏后（+10°调整）',
          '发力点偏移（调整手肘位置）',
        ],
        training_suggestions: [
          '加强站位训练，注意重心前移',
          '练习发力轨迹，保持手肘稳定',
          '建议预约专业教练进行针对性指导',
        ],
        key_frames: [
          'https://picsum.photos/200/150?random=31',
          'https://picsum.photos/200/150?random=32',
          'https://picsum.photos/200/150?random=33',
          'https://picsum.photos/200/150?random=34',
          'https://picsum.photos/200/150?random=35',
          'https://picsum.photos/200/150?random=36',
          'https://picsum.photos/200/150?random=37',
          'https://picsum.photos/200/150?random=38',
          'https://picsum.photos/200/150?random=39',
          'https://picsum.photos/200/150?random=40',
        ],
        status: 'completed',
        created_at: '2026-04-01T10:00:00Z',
        updated_at: '2026-04-01T10:01:00Z',
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('获取分析结果失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreMedal = (score: number) => {
    if (score >= 80) return '🥇';
    if (score >= 60) return '🥈';
    return '🥉';
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

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">分析结果不存在</p>
          <Link href="/analysis" className="text-green-700 hover:underline mt-2 inline-block">
            返回分析
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
            <h1 className="text-xl font-bold text-gray-900">分析报告</h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 综合评分 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-white">{analysis.score}</div>
                <div className="text-sm text-white/80">分</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-4xl">{getScoreMedal(analysis.score)}</span>
              <h2 className="text-2xl font-bold text-gray-900">
                {analysis.score >= 80 ? '优秀表现' : analysis.score >= 60 ? '良好表现' : '需加强训练'}
              </h2>
            </div>
            <p className="text-gray-600">综合表现良好，仍有提升空间</p>
          </div>
        </div>

        {/* 动作亮点 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">动作亮点</h3>
          </div>
          <div className="space-y-2">
            {analysis.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 需要改进 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">需要改进</h3>
          </div>
          <div className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">{improvement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 详细评分 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">详细评分</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">握杆</span>
                <span className={`font-semibold ${getScoreColor(analysis.grip_score)}`}>
                  {analysis.grip_score}分
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBg(analysis.grip_score)} h-2 rounded-full transition-all`}
                  style={{ width: `${analysis.grip_score}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">站位</span>
                <span className={`font-semibold ${getScoreColor(analysis.stance_score)}`}>
                  {analysis.stance_score}分
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBg(analysis.stance_score)} h-2 rounded-full transition-all`}
                  style={{ width: `${analysis.stance_score}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">发力</span>
                <span className={`font-semibold ${getScoreColor(analysis.power_score)}`}>
                  {analysis.power_score}分
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBg(analysis.power_score)} h-2 rounded-full transition-all`}
                  style={{ width: `${analysis.power_score}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">节奏</span>
                <span className={`font-semibold ${getScoreColor(analysis.rhythm_score)}`}>
                  {analysis.rhythm_score}分
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBg(analysis.rhythm_score)} h-2 rounded-full transition-all`}
                  style={{ width: `${analysis.rhythm_score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 训练建议 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">训练建议</h3>
          <div className="space-y-3 mb-4">
            {analysis.training_suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              <Play className="w-4 h-4" />
              <span>观看训练视频</span>
            </button>
            <Link
              href="/coaches"
              className="flex items-center space-x-2 px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>预约专业教练</span>
            </Link>
          </div>
        </div>

        {/* 关键帧分析 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">关键帧分析</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {analysis.key_frames.map((frame, index) => (
              <button
                key={index}
                onClick={() => setSelectedFrame(index)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedFrame === index
                    ? 'border-green-700'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={frame} alt={`帧 ${index + 1}`} className="w-full h-full object-cover" />
                {index === 1 || index === 5 ? (
                  <div className="absolute top-1 right-1">
                    <AlertCircle className="w-4 h-4 text-red-500 fill-red-100" />
                  </div>
                ) : null}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            ⚠️ 红色标注为问题帧，点击可放大查看
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 sm:flex-none px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              保存报告
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              分享
            </button>
            <Link
              href="/analysis"
              className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重新分析
            </Link>
            <Link
              href="/analysis/history"
              className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>查看历史</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
