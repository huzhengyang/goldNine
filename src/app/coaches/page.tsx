'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Clock,
  Award,
  Users,
  Filter,
  Video,
} from 'lucide-react';
import { ensureAuth, coachesCollection } from '@/lib/cloudbase';

// 教练数据类型
interface CoachItem {
  _id: string;
  name: string;
  avatar?: string;
  gender?: string;
  age?: number;
  description?: string;
  certifications?: string[];
  achievements?: string[];
  experience?: number;
  students?: number;
  rating: number;
  reviewCount?: number;
  specialty?: string[];
  venueAffiliation?: string[];
  priceMin?: number;
  priceMax?: number;
  priceUnit?: string;
  teachingTypes?: Array<{
    type: string;
    price: number;
    duration: number;
  }>;
  availableTime?: string[];
  status?: string;
  viewCount?: number;
  createdAt?: any;
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [activeExperience, setActiveExperience] = useState('all');
  const [activePrice, setActivePrice] = useState('all');

  useEffect(() => {
    fetchCoaches();
  }, [activeSpecialty, activeExperience, activePrice]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // 确保已登录
      await ensureAuth();
      
      // 构建查询条件
      let query = coachesCollection.where({
        status: 'active'
      });
      
      // 查询数据
      const result = await query
        .orderBy('rating', 'desc')
        .limit(20)
        .get();
      
      console.log('教练数据:', result.data);
      setCoaches(result.data || []);
    } catch (error) {
      console.error('获取教练列表失败:', error);
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    { key: 'all', label: '全部' },
    { key: '中式台球', label: '中式台球' },
    { key: '美式台球', label: '美式台球' },
    { key: '斯诺克', label: '斯诺克' },
    { key: '青少年培训', label: '青少年培训' },
  ];

  const experiences = [
    { key: 'all', label: '全部' },
    { key: '1-5', label: '1-5年' },
    { key: '5-10', label: '5-10年' },
    { key: '10+', label: '10年以上' },
  ];

  const prices = [
    { key: 'all', label: '全部' },
    { key: 'low', label: '¥150以下' },
    { key: 'medium', label: '¥150-300' },
    { key: 'high', label: '¥300以上' },
  ];

  const getStatusBadge = (status?: string) => {
    const badges = {
      active: { text: '可预约', className: 'bg-green-100 text-green-700' },
      busy: { text: '较忙', className: 'bg-yellow-100 text-yellow-700' },
      offline: { text: '离线', className: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[(status || 'active') as keyof typeof badges] || badges.offline;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">专业助教</h1>
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
            {/* 专业筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">专业</span>
              <div className="flex flex-wrap gap-1">
                {specialties.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSpecialty(s.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeSpecialty === s.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 经验筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">经验</span>
              <div className="flex space-x-1">
                {experiences.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => setActiveExperience(e.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeExperience === e.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 价格筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">价格</span>
              <div className="flex space-x-1">
                {prices.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setActivePrice(p.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activePrice === p.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 教练列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {coaches.map((coach) => (
              <Link
                key={coach._id}
                href={`/coaches/${coach._id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* 头像 */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={coach.avatar}
                        alt={coach.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {getStatusBadge(coach.status) && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          {getStatusBadge(coach.status)}
                        </div>
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors">
                            {coach.name}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span>{coach.gender === 'male' ? '男' : '女'}</span>
                            <span>•</span>
                            <span>{coach.age}岁</span>
                            <span>•</span>
                            <span>{coach.experience || 0}年经验</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-gray-900 font-semibold">{coach.rating}</span>
                          <span className="text-gray-500 text-sm">({coach.reviewCount || 0})</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{coach.description}</p>

                      {/* 认证 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {coach.certifications && coach.certifications.slice(0, 3).map((credential, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            <Award className="w-3 h-3" />
                            <span>{credential}</span>
                          </div>
                        ))}
                      </div>

                      {/* 专业 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {coach.specialty && coach.specialty.map((spec, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* 统计 */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{coach.students || 0}学员</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Video className="w-4 h-4" />
                          <span>教学视频</span>
                        </div>
                        <div className="flex items-center space-x-1 ml-auto">
                          <span className="text-green-700 font-semibold">
                            ¥{coach.priceMin || 0}-{coach.priceMax || 0}
                          </span>
                          <span>/小时</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {!loading && coaches.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors">
              加载更多
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && coaches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无教练</p>
          </div>
        )}
      </div>
    </div>
  );
}
