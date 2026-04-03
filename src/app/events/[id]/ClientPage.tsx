'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  DollarSign,
  ChevronLeft,
  Share2,
  Heart,
  Check,
  X,
  AlertCircle,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import { Event } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skill_level: 'bronze',
    note: '',
  });

  useEffect(() => {
    fetchEventDetail();
  }, [params.id]);

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockEvent: Event = {
        _id: params.id as string,
        name: '2026北京业余台球锦标赛',
        cover_image: 'https://picsum.photos/800/600?random=70',
        description: `北京市规模最大的业余台球赛事，由北京市台球协会主办。

本次锦标赛旨在推动台球运动在业余爱好者中的普及和发展，为广大台球爱好者提供一个展示自我、交流切磋的平台。

赛事采用国际标准规则，配备专业裁判团队，确保比赛的公平公正。欢迎广大台球爱好者踊跃报名参加！`,
        organizer: '北京市台球协会',
        venue_id: '1',
        venue_name: '金桌球俱乐部',
        event_type: 'amateur',
        game_type: 'chinese',
        format: 'knockout',
        prize_money: 50000,
        prize_distribution: '冠军: ¥20,000\n亚军: ¥10,000\n季军: ¥5,000\n第四名: ¥3,000\n5-8名: ¥1,500\n9-16名: ¥500',
        registration_fee: 200,
        registration_start: '2026-03-01T00:00:00Z',
        registration_end: '2026-04-15T23:59:59Z',
        event_start: '2026-04-20T09:00:00Z',
        event_end: '2026-04-22T18:00:00Z',
        max_participants: 128,
        current_participants: 86,
        status: 'registration',
        rules: `一、比赛规则
1. 采用中国台球协会审定的最新台球竞赛规则
2. 比赛采用单败淘汰制，三局两胜
3. 决赛采用五局三胜制

二、比赛流程
1. 签到时间：比赛当天提前30分钟到场签到
2. 抽签时间：比赛开始前15分钟进行抽签
3. 比赛时间：按照赛程表进行

三、其他规定
1. 参赛选手须携带有效身份证件
2. 比赛期间须遵守赛场纪律
3. 服从裁判判决，如有异议可向仲裁委员会申诉`,
        requirements: [
          '业余选手（无职业比赛经历）',
          '年满18周岁',
          '身体健康，适合参加体育比赛',
        ],
        announcements: [
          {
            title: '报名提醒',
            content: '报名截止时间为4月15日23:59，请尽早完成报名。',
            created_at: '2026-03-15T10:00:00Z',
          },
          {
            title: '赛程公布',
            content: '最终赛程将于4月18日公布，请关注后续通知。',
            created_at: '2026-03-20T14:30:00Z',
          },
        ],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      setEvent(mockEvent);
    } catch (error) {
      console.error('获取赛事详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!formData.name || !formData.phone) {
      alert('请填写完整信息');
      return;
    }

    // TODO: 调用报名API
    alert('报名成功！我们会尽快与您联系确认。');
    setShowRegistration(false);
    setFormData({ name: '', phone: '', skill_level: 'bronze', note: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      registration: { text: '报名中', className: 'bg-green-500 text-white' },
      ongoing: { text: '进行中', className: 'bg-blue-500 text-white' },
      completed: { text: '已结束', className: 'bg-gray-500 text-white' },
      cancelled: { text: '已取消', className: 'bg-red-500 text-white' },
    };
    const badge = badges[status as keyof typeof badges] || badges.completed;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getGameTypeName = (type: string) => {
    const names = {
      chinese: '中式台球',
      american: '美式台球',
      snooker: '斯诺克',
    };
    return names[type as keyof typeof names] || type;
  };

  const getFormatName = (format: string) => {
    const names = {
      knockout: '淘汰赛',
      'round-robin': '循环赛',
      mixed: '混合赛制',
    };
    return names[format as keyof typeof names] || format;
  };

  const getSkillLevelName = (level: string) => {
    const levels = {
      bronze: '青铜',
      silver: '白银',
      gold: '黄金',
      platinum: '铂金',
      diamond: '钻石',
      master: '大师',
    };
    return levels[level as keyof typeof levels] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">赛事不存在</p>
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
      {/* 头部图片 */}
      <div className="relative h-64 sm:h-96 bg-gray-200">
        <img
          src={event.cover_image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

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

        {/* 状态标签 */}
        <div className="absolute bottom-4 left-4">{getStatusBadge(event.status)}</div>

        {/* 奖金 */}
        {event.prize_money > 0 && (
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div className="text-right">
              <p className="text-xs text-gray-300">总奖金</p>
              <p className="text-xl font-bold text-white">
                ¥{event.prize_money.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">比赛时间</p>
                <p className="font-medium">
                  {formatDate(event.event_start)} - {formatDate(event.event_end)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">比赛地点</p>
                <Link
                  href={`/venues/${event.venue_id}`}
                  className="font-medium text-green-700 hover:text-green-800"
                >
                  {event.venue_name}
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">报名人数</p>
                <p className="font-medium">
                  {event.current_participants}/{event.max_participants}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">报名费</p>
                <p className="font-medium text-green-700">
                  {event.registration_fee === 0 ? '免费' : `¥${event.registration_fee}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              {getGameTypeName(event.game_type)}
            </span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
              {getFormatName(event.format)}
            </span>
            <span className="text-sm text-gray-600">主办方：{event.organizer}</span>
          </div>

          {/* 报名进度 */}
          {event.status === 'registration' && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">报名进度</span>
                <span className="text-green-700 font-medium">
                  {((event.current_participants / event.max_participants) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{
                    width: `${(event.current_participants / event.max_participants) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                报名截止：{formatDateTime(event.registration_end)}
              </p>
            </div>
          )}

          {/* 报名按钮 */}
          {event.status === 'registration' && (
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium text-lg"
            >
              立即报名
            </button>
          )}

          {event.status === 'ongoing' && (
            <button className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-lg">
              查看赛程
            </button>
          )}

          {event.status === 'completed' && (
            <button className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg">
              查看成绩
            </button>
          )}
        </div>

        {/* 奖金分配 */}
        {event.prize_money > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>奖金分配</span>
            </h2>
            <div className="bg-yellow-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700 font-medium">
                {event.prize_distribution}
              </pre>
            </div>
          </div>
        )}

        {/* 参赛要求 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span>参赛要求</span>
          </h2>
          <ul className="space-y-2">
            {event.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 比赛规则 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <span>比赛规则</span>
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <pre className="whitespace-pre-wrap font-sans">{event.rules}</pre>
          </div>
        </div>

        {/* 赛事公告 */}
        {event.announcements && event.announcements.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">赛事公告</h2>
            <div className="space-y-4">
              {event.announcements.map((announcement, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDateTime(announcement.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 赛事简介 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">赛事简介</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <pre className="whitespace-pre-wrap font-sans">{event.description}</pre>
          </div>
        </div>
      </div>

      {/* 报名弹窗 */}
      {showRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">赛事报名</h3>
              <button
                onClick={() => setShowRegistration(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入姓名"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  技能等级
                </label>
                <select
                  value={formData.skill_level}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="bronze">青铜</option>
                  <option value="silver">白银</option>
                  <option value="gold">黄金</option>
                  <option value="platinum">铂金</option>
                  <option value="diamond">钻石</option>
                  <option value="master">大师</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="请输入备注信息（选填）"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">报名费</span>
                  <span className="text-green-700 font-semibold">
                    {event.registration_fee === 0 ? '免费' : `¥${event.registration_fee}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  报名成功后，工作人员会在24小时内与您联系确认参赛信息
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleRegistration}
                className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                确认报名
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
