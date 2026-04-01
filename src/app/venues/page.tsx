'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Heart,
  Filter,
  Map,
} from 'lucide-react';
import { Venue } from '@/types';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDistance, setActiveDistance] = useState('all');
  const [activePrice, setActivePrice] = useState('all');
  const [activeRating, setActiveRating] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    fetchVenues();
  }, [activeDistance, activePrice, activeRating, sortBy]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockVenues: Venue[] = [
        {
          _id: '1',
          name: '金桌球俱乐部',
          cover_image: 'https://picsum.photos/800/600?random=50',
          images: [],
          description: '专业台球俱乐部，设施齐全，环境优雅',
          address: '北京市朝阳区建国路88号',
          city: '北京市',
          district: '朝阳区',
          location: { type: 'Point', coordinates: [116.46, 39.92] },
          phone: '010-12345678',
          business_hours: { start: '09:00', end: '23:00' },
          rating: 4.8,
          review_count: 328,
          price_range: { min: 30, max: 30 },
          tables: { chinese: 12, american: 8, british: 0 },
          facilities: ['空调', 'WiFi', '餐饮', '休息区'],
          status: 'open',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        {
          _id: '2',
          name: '星牌台球城',
          cover_image: 'https://picsum.photos/800/600?random=51',
          images: [],
          description: '星牌品牌球房，专业球桌',
          address: '北京市海淀区中关村大街66号',
          city: '北京市',
          district: '海淀区',
          location: { type: 'Point', coordinates: [116.32, 39.98] },
          phone: '010-87654321',
          business_hours: { start: '10:00', end: '22:00' },
          rating: 4.6,
          review_count: 256,
          price_range: { min: 25, max: 25 },
          tables: { chinese: 20, american: 0, british: 4 },
          facilities: ['空调', '休息区'],
          status: 'open',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        {
          _id: '3',
          name: '台球之家',
          cover_image: 'https://picsum.photos/800/600?random=52',
          images: [],
          description: '性价比高的台球俱乐部',
          address: '北京市西城区西单北大街100号',
          city: '北京市',
          district: '西城区',
          location: { type: 'Point', coordinates: [116.37, 39.91] },
          phone: '010-11112222',
          business_hours: { start: '08:00', end: '24:00' },
          rating: 4.5,
          review_count: 189,
          price_range: { min: 20, max: 20 },
          tables: { chinese: 15, american: 5, british: 0 },
          facilities: ['空调', 'WiFi'],
          status: 'open',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];

      setVenues(mockVenues);
    } catch (error) {
      console.error('获取球房列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const distances = [
    { key: 'all', label: '全部' },
    { key: '1km', label: '1km' },
    { key: '3km', label: '3km' },
    { key: '5km', label: '5km' },
  ];

  const prices = [
    { key: 'all', label: '全部' },
    { key: 'low', label: '低价' },
    { key: 'medium', label: '中价' },
    { key: 'high', label: '高价' },
  ];

  const ratings = [
    { key: 'all', label: '全部' },
    { key: '4.5', label: '4.5分以上' },
    { key: '4.0', label: '4分以上' },
  ];

  const sortOptions = [
    { key: 'distance', label: '距离最近' },
    { key: 'rating', label: '评分最高' },
    { key: 'price', label: '价格最低' },
    { key: 'popularity', label: '热度最高' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          营业中
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
        休息中
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">附近球房</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <MapPin className="w-4 h-4" />
                <span>北京</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Map className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 筛选条件 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 距离筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">距离</span>
              <select
                value={activeDistance}
                onChange={(e) => setActiveDistance(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {distances.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 价格筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">价格</span>
              <select
                value={activePrice}
                onChange={(e) => setActivePrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {prices.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 评分筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">评分</span>
              <select
                value={activeRating}
                onChange={(e) => setActiveRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {ratings.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 排序 */}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">排序</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sortOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 球房列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <Link
                key={venue._id}
                href={`/venues/${venue._id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* 图片 */}
                  <div className="relative sm:w-48 md:w-56 h-48 sm:h-auto flex-shrink-0">
                    <img
                      src={venue.cover_image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    {getStatusBadge(venue.status)}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-gray-900 font-semibold">{venue.rating}</span>
                        <span className="text-gray-500 text-sm">({venue.review_count})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-green-700 font-semibold">
                          ¥{venue.price_range.min}
                        </span>
                        <span>/小时</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>1.2km</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {venue.business_hours.start}-{venue.business_hours.end}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {venue.tables.chinese > 0 && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          中式{venue.tables.chinese}桌
                        </span>
                      )}
                      {venue.tables.american > 0 && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          美式{venue.tables.american}桌
                        </span>
                      )}
                      {venue.tables.british > 0 && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          英式{venue.tables.british}桌
                        </span>
                      )}
                      {venue.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm">
                        立即预订
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Navigation className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {!loading && venues.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors">
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
