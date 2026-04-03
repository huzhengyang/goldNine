'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  DollarSign,
  Filter,
} from 'lucide-react';
import { ensureAuth, eventsCollection } from '@/lib/cloudbase';

// 赛事数据类型
interface EventItem {
  _id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  organizer?: string;
  venueName?: string;
  address?: string;
  level?: string;
  gameType?: string;
  format?: string;
  prizePool?: number;
  entryFee?: number;
  currentParticipants?: number;
  maxParticipants?: number;
  startDate?: any;
  endDate?: any;
  registrationDeadline?: any;
  status?: string;
  rules?: string;
  eligibility?: string;
  viewCount?: number;
  createdAt?: any;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [activeStatus, activeType]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // 确保已登录
      await ensureAuth();
      
      // 构建查询条件
      const statusFilter = activeStatus !== 'all' ? activeStatus : 'registering';
      
      // 查询数据
      const result = await eventsCollection
        .where({ status: statusFilter })
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
      
      console.log('赛事数据:', result.data);
      setEvents(result.data || []);
    } catch (error) {
      console.error('获取赛事列表失败:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { key: 'all', label: '全部' },
    { key: 'registration', label: '报名中' },
    { key: 'ongoing', label: '进行中' },
    { key: 'completed', label: '已结束' },
  ];

  const typeFilters = [
    { key: 'all', label: '全部' },
    { key: 'amateur', label: '业余赛' },
    { key: 'professional', label: '职业赛' },
    { key: 'commercial', label: '商业赛' },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      registration: { text: '报名中', className: 'bg-green-100 text-green-700' },
      ongoing: { text: '进行中', className: 'bg-blue-100 text-blue-700' },
      completed: { text: '已结束', className: 'bg-gray-100 text-gray-700' },
      cancelled: { text: '已取消', className: 'bg-red-100 text-red-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.completed;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getEventTypeBadge = (type: string) => {
    const types = {
      amateur: { text: '业余赛', className: 'bg-purple-50 text-purple-700' },
      professional: { text: '职业赛', className: 'bg-yellow-50 text-yellow-700' },
      commercial: { text: '商业赛', className: 'bg-blue-50 text-blue-700' },
    };
    const t = types[type as keyof typeof types] || types.amateur;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${t.className}`}>
        {t.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">台球赛事</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 筛选条件 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* 状态筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">状态</span>
              <div className="flex space-x-1">
                {statusFilters.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveStatus(s.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeStatus === s.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 类型筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">类型</span>
              <div className="flex space-x-1">
                {typeFilters.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveType(t.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeType === t.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 赛事列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* 图片 */}
                <div className="relative h-48">
                  <img
                    src={event.imageUrl || `https://picsum.photos/800/600?random=${event._id}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {getStatusBadge(event.status || 'registering')}
                  </div>
                  {event.prizePool && event.prizePool > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-semibold">
                        ¥{event.prizePool.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* 内容 */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.venueName || event.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {event.currentParticipants || 0}/{event.maxParticipants || 100} 人
                      </span>
                    </div>
                  </div>

                  {/* 报名进度 */}
                  {event.status === 'registering' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>报名进度</span>
                        <span>
                          {getProgressPercentage(event.currentParticipants || 0, event.maxParticipants || 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all"
                          style={{
                            width: `${getProgressPercentage(event.currentParticipants || 0, event.maxParticipants || 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 报名费 */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-700" />
                      <span className="text-green-700 font-semibold">
                        {event.entryFee === 0 ? '免费' : `¥${event.entryFee || 0}`}
                      </span>
                    </div>
                    {event.status === 'registering' && (
                      <span className="text-xs text-gray-500">
                        截止：{formatDate(event.registrationDeadline)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {!loading && events.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors">
              加载更多
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无赛事</p>
          </div>
        )}
      </div>
    </div>
  );
}
