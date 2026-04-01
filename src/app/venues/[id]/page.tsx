'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Check,
  X,
} from 'lucide-react';
import { Venue, VenueReview } from '@/types';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<VenueReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTableType, setSelectedTableType] = useState('');
  const [selectedTable, setSelectedTable] = useState('');

  useEffect(() => {
    fetchVenueDetail();
  }, [params.id]);

  const fetchVenueDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockVenue: Venue = {
        _id: params.id as string,
        name: '金桌球俱乐部',
        cover_image: 'https://picsum.photos/800/600?random=50',
        images: [
          'https://picsum.photos/800/600?random=50',
          'https://picsum.photos/800/600?random=51',
          'https://picsum.photos/800/600?random=52',
          'https://picsum.photos/800/600?random=53',
        ],
        description: '金桌球俱乐部是一家专业的台球俱乐部，拥有20多年的历史。我们提供优质的中式、美式、英式台球桌，环境优雅，设施齐全。俱乐部内设有空调、WiFi、休息区、餐饮服务，是您休闲娱乐的理想选择。',
        address: '北京市朝阳区建国路88号SOHO现代城B1层',
        city: '北京市',
        district: '朝阳区',
        location: { type: 'Point', coordinates: [116.46, 39.92] },
        phone: '010-12345678',
        business_hours: { start: '09:00', end: '23:00' },
        rating: 4.8,
        review_count: 328,
        price_range: { min: 30, max: 50 },
        tables: { chinese: 12, american: 8, british: 4 },
        facilities: ['空调', 'WiFi', '餐饮', '休息区', '球具店', '淋浴'],
        table_brand: '星牌',
        member_price: {
          monthly: 299,
          quarterly: 799,
          yearly: 2899,
        },
        promotions: ['新会员首月半价', '充值满500送100', '每周二会员日8折'],
        status: 'open',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const mockReviews: VenueReview[] = [
        {
          _id: '1',
          venue_id: params.id as string,
          user_id: 'u1',
          user_name: '台球迷',
          user_avatar: 'https://picsum.photos/100/100?random=60',
          rating: 5,
          environment_rating: 5,
          service_rating: 5,
          facility_rating: 5,
          content: '环境非常好，球桌维护得很专业，服务态度也很棒！',
          like_count: 12,
          created_at: '2026-03-15T10:30:00Z',
        },
        {
          _id: '2',
          venue_id: params.id as string,
          user_id: 'u2',
          user_name: '球迷小王',
          user_avatar: 'https://picsum.photos/100/100?random=61',
          rating: 4,
          environment_rating: 4,
          service_rating: 5,
          facility_rating: 4,
          content: '总体不错，就是周末人比较多，建议提前预约。',
          images: ['https://picsum.photos/400/300?random=62'],
          like_count: 8,
          created_at: '2026-03-10T15:20:00Z',
        },
      ];

      setVenue(mockVenue);
      setReviews(mockReviews);
    } catch (error) {
      console.error('获取球房详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
  ];

  const getAvailableTables = () => {
    const tables = [];
    if (venue) {
      for (let i = 1; i <= venue.tables.chinese; i++) {
        tables.push({ id: `c${i}`, name: `中式 ${i}号`, type: 'chinese', price: venue.price_range.min });
      }
      for (let i = 1; i <= venue.tables.american; i++) {
        tables.push({ id: `a${i}`, name: `美式 ${i}号`, type: 'american', price: venue.price_range.max });
      }
      for (let i = 1; i <= venue.tables.british; i++) {
        tables.push({ id: `b${i}`, name: `英式 ${i}号`, type: 'british', price: venue.price_range.max });
      }
    }
    return tables;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedTable) {
      alert('请选择完整的预约信息');
      return;
    }
    // TODO: 调用预约API
    alert(`预约成功！\n日期：${selectedDate}\n时间：${selectedTime}\n球桌：${selectedTable}`);
    setShowBooking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">球房不存在</p>
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
      {/* 图片轮播 */}
      <div className="relative h-64 sm:h-96 bg-gray-200">
        <img
          src={venue.images[activeImageIndex] || venue.cover_image}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* 收藏和分享 */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* 图片指示器 */}
        {venue.images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? venue.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === venue.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {venue.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* 状态标签 */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              venue.status === 'open'
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {venue.status === 'open' ? '营业中' : '休息中'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900">{venue.rating}</span>
                  <span>({venue.review_count}条评价)</span>
                </div>
                <span>•</span>
                <span className="text-green-700 font-semibold">¥{venue.price_range.min}-{venue.price_range.max}/小时</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{venue.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">
                营业时间：{venue.business_hours.start} - {venue.business_hours.end}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <a href={`tel:${venue.phone}`} className="text-green-700 hover:text-green-800">
                {venue.phone}
              </a>
            </div>
            {venue.table_brand && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-400 text-center text-xs">桌</span>
                <span className="text-gray-700">球桌品牌：{venue.table_brand}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => setShowBooking(true)}
              className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              立即预约
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:border-green-700 hover:text-green-700 transition-colors">
              <Navigation className="w-5 h-5" />
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:border-green-700 hover:text-green-700 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 球桌信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">球桌信息</h2>
          <div className="grid grid-cols-3 gap-4">
            {venue.tables.chinese > 0 && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{venue.tables.chinese}</p>
                <p className="text-sm text-gray-600 mt-1">中式球桌</p>
              </div>
            )}
            {venue.tables.american > 0 && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{venue.tables.american}</p>
                <p className="text-sm text-gray-600 mt-1">美式球桌</p>
              </div>
            )}
            {venue.tables.british > 0 && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">{venue.tables.british}</p>
                <p className="text-sm text-gray-600 mt-1">英式球桌</p>
              </div>
            )}
          </div>
        </div>

        {/* 设施服务 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">设施服务</h2>
          <div className="flex flex-wrap gap-3">
            {venue.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 会员价格 */}
        {venue.member_price && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">会员价格</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">月卡</p>
                <p className="text-2xl font-bold text-green-700">¥{venue.member_price.monthly}</p>
              </div>
              <div className="text-center p-4 border-2 border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">季卡</p>
                <p className="text-2xl font-bold text-yellow-700">¥{venue.member_price.quarterly}</p>
                <p className="text-xs text-gray-500 mt-1">省¥{venue.member_price.monthly * 3 - venue.member_price.quarterly}</p>
              </div>
              <div className="text-center p-4 border-2 border-purple-200 rounded-lg relative">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                  推荐
                </span>
                <p className="text-sm text-gray-600 mb-2">年卡</p>
                <p className="text-2xl font-bold text-purple-700">¥{venue.member_price.yearly}</p>
                <p className="text-xs text-gray-500 mt-1">省¥{venue.member_price.monthly * 12 - venue.member_price.yearly}</p>
              </div>
            </div>
          </div>
        )}

        {/* 优惠活动 */}
        {venue.promotions && venue.promotions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">优惠活动</h2>
            <div className="space-y-3">
              {venue.promotions.map((promo, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg"
                >
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">优惠</span>
                  <span className="text-gray-700">{promo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 用户评价 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">用户评价</h2>
            <Link
              href={`/venues/${venue._id}/reviews`}
              className="text-sm text-green-700 hover:text-green-800"
            >
              查看全部 →
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.user_avatar}
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{review.user_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.content}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无评价
            </div>
          )}
        </div>

        {/* 简介 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">球房简介</h2>
          <p className="text-gray-700 leading-relaxed">{venue.description}</p>
        </div>
      </div>

      {/* 预约弹窗 */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">预约球桌</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择日期
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* 选择时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择时间
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === slot
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 选择球桌类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  球桌类型
                </label>
                <div className="flex space-x-2">
                  {venue.tables.chinese > 0 && (
                    <button
                      onClick={() => {
                        setSelectedTableType('chinese');
                        setSelectedTable('');
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        selectedTableType === 'chinese'
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      中式 (¥{venue.price_range.min}/h)
                    </button>
                  )}
                  {venue.tables.american > 0 && (
                    <button
                      onClick={() => {
                        setSelectedTableType('american');
                        setSelectedTable('');
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        selectedTableType === 'american'
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      美式 (¥{venue.price_range.max}/h)
                    </button>
                  )}
                  {venue.tables.british > 0 && (
                    <button
                      onClick={() => {
                        setSelectedTableType('british');
                        setSelectedTable('');
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        selectedTableType === 'british'
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-700'
                      }`}
                    >
                      英式 (¥{venue.price_range.max}/h)
                    </button>
                  )}
                </div>
              </div>

              {/* 选择球桌 */}
              {selectedTableType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择球桌
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {getAvailableTables()
                      .filter((t) => t.type === selectedTableType)
                      .map((table) => (
                        <button
                          key={table.id}
                          onClick={() => setSelectedTable(table.id)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            selectedTable === table.id
                              ? 'border-green-700 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-700'
                          }`}
                        >
                          {table.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
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
