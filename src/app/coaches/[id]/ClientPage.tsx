'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Users,
  Award,
  Video,
  Play,
  Check,
  X,
  Calendar,
  Phone,
} from 'lucide-react';
import { Coach, CoachVideo } from '@/types';

export default function CoachDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [videos, setVideos] = useState<CoachVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTeachingType, setSelectedTeachingType] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchCoachDetail();
  }, [params.id]);

  const fetchCoachDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockCoach: Coach = {
        _id: params.id as string,
        name: '张教练',
        avatar: 'https://picsum.photos/200/200?random=80',
        gender: 'male',
        age: 35,
        bio: '前国家队选手，15年执教经验。擅长中式台球教学，注重基本功训练和比赛心理辅导。教学风格严谨细致，因材施教，帮助学员快速提升技术水平。曾培养出多名省级冠军选手。',
        credentials: [
          '国家一级教练员',
          '前国家队队员',
          '北京体育大学硕士',
          '中式台球职业裁判员',
        ],
        teaching_experience: 15,
        student_count: 1280,
        satisfaction_rate: 98,
        teaching_types: ['beginner', 'intermediate', 'professional'],
        specialties: ['中式台球', '基本功训练', '比赛心理', '技术分析'],
        venue_ids: ['1', '2'],
        venue_names: ['金桌球俱乐部', '星牌台球城'],
        price_range: { min: 200, max: 500 },
        prices: {
          beginner: 200,
          intermediate: 300,
          professional: 500,
          youth: 180,
        },
        rating: 4.9,
        review_count: 256,
        video_count: 48,
        available_times: [
          {
            date: '2026-04-02',
            slots: [
              { start: '09:00', end: '10:00', available: true },
              { start: '10:00', end: '11:00', available: true },
              { start: '14:00', end: '15:00', available: false },
              { start: '15:00', end: '16:00', available: true },
              { start: '19:00', end: '20:00', available: true },
            ],
          },
          {
            date: '2026-04-03',
            slots: [
              { start: '09:00', end: '10:00', available: true },
              { start: '11:00', end: '12:00', available: true },
              { start: '14:00', end: '15:00', available: true },
              { start: '16:00', end: '17:00', available: false },
            ],
          },
        ],
        status: 'available',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const mockVideos: CoachVideo[] = [
        {
          _id: 'v1',
          coach_id: params.id as string,
          title: '中式台球基础握杆姿势',
          description: '详细讲解正确的握杆姿势，适合初学者',
          thumbnail: 'https://picsum.photos/400/300?random=90',
          video_url: 'https://example.com/video1.mp4',
          duration: 15,
          view_count: 3256,
          like_count: 189,
          tags: ['基础', '握杆', '入门'],
          created_at: '2026-02-15T10:00:00Z',
        },
        {
          _id: 'v2',
          coach_id: params.id as string,
          title: '如何提高击球稳定性',
          description: '分享提高击球稳定性的技巧和方法',
          thumbnail: 'https://picsum.photos/400/300?random=91',
          video_url: 'https://example.com/video2.mp4',
          duration: 22,
          view_count: 2180,
          like_count: 156,
          tags: ['技巧', '稳定性', '进阶'],
          created_at: '2026-02-20T14:30:00Z',
        },
        {
          _id: 'v3',
          coach_id: params.id as string,
          title: '台球比赛心理调节',
          description: '比赛中的心理调节技巧',
          thumbnail: 'https://picsum.photos/400/300?random=92',
          video_url: 'https://example.com/video3.mp4',
          duration: 18,
          view_count: 1542,
          like_count: 98,
          tags: ['心理', '比赛', '高级'],
          created_at: '2026-03-01T09:00:00Z',
        },
      ];

      setCoach(mockCoach);
      setVideos(mockVideos);
    } catch (error) {
      console.error('获取教练详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedTeachingType) {
      alert('请选择完整的预约信息');
      return;
    }
    // TODO: 调用预约API
    alert('预约成功！教练会尽快与您联系确认。');
    setShowBooking(false);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedTeachingType('');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: { text: '可预约', className: 'bg-green-500 text-white' },
      busy: { text: '较忙', className: 'bg-yellow-500 text-white' },
      offline: { text: '离线', className: 'bg-gray-500 text-white' },
    };
    const badge = badges[status as keyof typeof badges] || badges.offline;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getTeachingTypeName = (type: string) => {
    const types = {
      beginner: '入门教学',
      intermediate: '进阶教学',
      professional: '专业教学',
      youth: '青少年教学',
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">教练不存在</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-green-700 hover:text-green-800"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="relative bg-gradient-to-br from-green-600 to-green-800 text-white">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* 收藏和分享 */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button className="p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="flex items-start space-x-6">
            {/* 头像 */}
            <div className="relative">
              <img
                src={coach.avatar}
                alt={coach.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {getStatusBadge(coach.status) && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  {getStatusBadge(coach.status)}
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-bold mb-2">{coach.name}</h1>
              <div className="flex items-center space-x-3 text-white/90 mb-3">
                <span>{coach.gender === 'male' ? '男' : '女'}</span>
                <span>•</span>
                <span>{coach.age}岁</span>
                <span>•</span>
                <span>{coach.teaching_experience}年经验</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold">{coach.rating}</span>
                  <span className="text-white/80">({coach.review_count}评价)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>{coach.student_count}学员</span>
                </div>
              </div>
            </div>

            {/* 价格 */}
            <div className="text-right pt-2">
              <p className="text-white/80 text-sm mb-1">课时费</p>
              <p className="text-3xl font-bold">
                ¥{coach.price_range.min}-{coach.price_range.max}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'about', label: '关于教练' },
                { key: 'videos', label: '教学视频' },
                { key: 'reviews', label: '学员评价' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 关于教练 */}
          {activeTab === 'about' && (
            <div className="p-6 space-y-6">
              {/* 简介 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">个人简介</h3>
                <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
              </div>

              {/* 资质认证 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>资质认证</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {coach.credentials.map((credential, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{credential}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 专业领域 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">专业领域</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* 教学地点 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span>教学地点</span>
                </h3>
                <div className="space-y-2">
                  {coach.venue_names.map((venue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{venue}</span>
                      <Link
                        href={`/venues/${coach.venue_ids[index]}`}
                        className="text-green-700 hover:text-green-800 text-sm"
                      >
                        查看详情 →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* 教学类型和价格 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">教学类型及价格</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(coach.prices).map(([type, price]) => (
                    <div
                      key={type}
                      className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <p className="text-sm text-gray-600 mb-1">
                        {getTeachingTypeName(type)}
                      </p>
                      <p className="text-2xl font-bold text-green-700">¥{price}</p>
                      <p className="text-xs text-gray-500">/课时</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{coach.student_count}</p>
                  <p className="text-sm text-gray-600 mt-1">学员数量</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{coach.satisfaction_rate}%</p>
                  <p className="text-sm text-gray-600 mt-1">好评率</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{coach.video_count}</p>
                  <p className="text-sm text-gray-600 mt-1">教学视频</p>
                </div>
              </div>
            </div>
          )}

          {/* 教学视频 */}
          {activeTab === 'videos' && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-green-700 ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {video.duration}分钟
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{video.view_count}观看</span>
                          <span>{video.like_count}点赞</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 学员评价 */}
          {activeTab === 'reviews' && (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                评价功能开发中...
              </div>
            </div>
          )}
        </div>

        {/* 预约按钮 */}
        {coach.status === 'available' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">课时费</p>
                <p className="text-2xl font-bold text-green-700">
                  ¥{coach.price_range.min}-{coach.price_range.max}
                </p>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium text-lg"
              >
                立即预约
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 预约弹窗 */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">预约教练</h3>
              <button
                onClick={() => setShowBooking(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* 选择日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>选择日期</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {coach.available_times.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedTime('');
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedDate === day.date
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      {new Date(day.date).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {/* 选择时间 */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>选择时间</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {coach.available_times
                      .find((d) => d.date === selectedDate)
                      ?.slots.map((slot) => (
                        <button
                          key={slot.start}
                          onClick={() => slot.available && setSelectedTime(slot.start)}
                          disabled={!slot.available}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            selectedTime === slot.start
                              ? 'border-green-700 bg-green-50 text-green-700'
                              : slot.available
                              ? 'border-gray-300 hover:border-green-700'
                              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.start}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* 选择教学类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  教学类型
                </label>
                <div className="space-y-2">
                  {Object.entries(coach.prices).map(([type, price]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTeachingType(type)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedTeachingType === type
                          ? 'border-green-700 bg-green-50'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      <span className="font-medium text-gray-900">
                        {getTeachingTypeName(type)}
                      </span>
                      <span className="text-green-700 font-semibold">¥{price}/课时</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注信息
                </label>
                <textarea
                  placeholder="请输入您的学习需求或特殊要求（选填）"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  预约成功后，教练会在24小时内与您联系确认上课时间和地点。
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleBooking}
                className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                确认预约
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
