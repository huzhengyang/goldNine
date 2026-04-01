'use client';

import { useState, useEffect } from 'react';
import { testConnection, getNews, getVenues, getEvents, getCoaches } from '@/lib/api';

export default function TestPage() {
  const [status, setStatus] = useState<string>('测试中...');
  const [news, setNews] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    async function testCloudBase() {
      console.log('🧪 开始测试 CloudBase 连接...');
      
      // 测试连接
      const testResult = await testConnection();
      if (testResult.error) {
        setStatus(`❌ 连接失败: ${testResult.error}`);
        console.error('连接失败:', testResult.error);
      } else {
        setStatus(`✅ 连接成功: ${JSON.stringify(testResult.data)}`);
        console.log('连接成功:', testResult.data);
      }

      // 测试获取新闻
      const newsResult = await getNews(5);
      if (newsResult.data) {
        setNews(newsResult.data.data || []);
        console.log('新闻数据:', newsResult.data);
      }

      // 测试获取球房
      const venuesResult = await getVenues(5);
      if (venuesResult.data) {
        setVenues(venuesResult.data.data || []);
        console.log('球房数据:', venuesResult.data);
      }

      // 测试获取赛事
      const eventsResult = await getEvents(5);
      if (eventsResult.data) {
        setEvents(eventsResult.data.data || []);
        console.log('赛事数据:', eventsResult.data);
      }

      // 测试获取助教
      const coachesResult = await getCoaches(5);
      if (coachesResult.data) {
        setCoaches(coachesResult.data.data || []);
        console.log('助教数据:', coachesResult.data);
      }
    }

    testCloudBase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          CloudBase 连接测试
        </h1>

        {/* 连接状态 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">连接状态</h2>
          <p className="text-gray-700">{status}</p>
        </div>

        {/* 新闻数据 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            新闻列表 ({news.length} 条)
          </h2>
          {news.length > 0 ? (
            <ul className="space-y-2">
              {news.map((item: any, index) => (
                <li key={index} className="text-gray-700">
                  {item.title || item._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 球房数据 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            球房列表 ({venues.length} 条)
          </h2>
          {venues.length > 0 ? (
            <ul className="space-y-2">
              {venues.map((item: any, index) => (
                <li key={index} className="text-gray-700">
                  {item.name || item._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 赛事数据 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            赛事列表 ({events.length} 条)
          </h2>
          {events.length > 0 ? (
            <ul className="space-y-2">
              {events.map((item: any, index) => (
                <li key={index} className="text-gray-700">
                  {item.title || item._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 助教数据 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            助教列表 ({coaches.length} 条)
          </h2>
          {coaches.length > 0 ? (
            <ul className="space-y-2">
              {coaches.map((item: any, index) => (
                <li key={index} className="text-gray-700">
                  {item.name || item._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 返回首页 */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
