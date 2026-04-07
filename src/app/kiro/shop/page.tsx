'use client';

import { useState, useEffect } from 'react';
import cloudbase from '@cloudbase/js-sdk';

// 账户类型配置
const ACCOUNT_TYPES = {
  normal: { label: '普通账户', color: 'gray', bgColor: 'bg-gray-500/30', textColor: 'text-gray-300', borderColor: 'border-gray-500/50', icon: '👤' },
  '1000i': { label: '1000i积分', color: 'blue', bgColor: 'bg-blue-500/30', textColor: 'text-blue-300', borderColor: 'border-blue-500/50', icon: '💎' },
  '2000': { label: '2000计分', color: 'purple', bgColor: 'bg-purple-500/30', textColor: 'text-purple-300', borderColor: 'border-purple-500/50', icon: '⭐' },
  '10000': { label: '10000计分', color: 'yellow', bgColor: 'bg-yellow-500/30', textColor: 'text-yellow-300', borderColor: 'border-yellow-500/50', icon: '🌟' }
} as const;

type AccountType = keyof typeof ACCOUNT_TYPES;

interface KiroAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  receiveCodeUrl: string;
  twoFaCode: string;
  backupEmail: string;
  createdAt: string;
  accountType?: AccountType;
  googleSold?: boolean;
  amazonSold?: boolean;
  githubSold?: boolean;
}

interface ShopOrder {
  id: string;
  orderId: string;          // 订单号
  accountType: AccountType; // 商品类型
  accountId?: string;       // 分配的账户ID
  price: number;            // 价格
  status: 'pending' | 'paid' | 'delivered' | 'cancelled'; // 订单状态
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  shareUrl?: string;        // 分享链接
}

interface PriceConfig {
  [key: string]: number;    // 每种类型的价格
}

// 默认价格配置
const DEFAULT_PRICES: PriceConfig = {
  normal: 9.9,
  '1000i': 19.9,
  '2000': 29.9,
  '10000': 49.9
};

// 收款码图片（微信经营收款码）
const PAYMENT_QR = '/images/payment-qrcode.jpg';

export default function KiroShopPage() {
  const [accounts, setAccounts] = useState<KiroAccount[]>([]);
  const [prices, setPrices] = useState<PriceConfig>(DEFAULT_PRICES);
  const [selectedType, setSelectedType] = useState<AccountType | 'all'>('all');
  const [currentOrder, setCurrentOrder] = useState<ShopOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 加载账户和价格
  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      // 使用本地 API 加载数据
      const [accRes, priceRes] = await Promise.all([
        fetch('/api/shop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'getAccounts' }) }),
        fetch('/api/shop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'getPrices' }) })
      ]);

      const accData = await accRes.json();
      const priceData = await priceRes.json();

      if (accData.code === 0 && accData.data) {
        setAccounts(accData.data);
      }

      if (priceData.code === 0 && priceData.data) {
        setPrices(priceData.data);
      }
    } catch (error) {
      console.error('加载商店数据失败:', error);
    }
    setLoading(false);
  };

  // 统计各类型库存（未售出的）
  const getStockCount = (type: AccountType): number => {
    return accounts.filter(acc => 
      acc.accountType === type && 
      !acc.googleSold && !acc.amazonSold && !acc.githubSold
    ).length;
  };

  // 创建订单
  const handleBuyNow = async (type: AccountType) => {
    const stock = getStockCount(type);
    if (stock <= 0) {
      alert('抱歉，该商品已售罄！');
      return;
    }

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createOrder',
          accountType: type,
          price: prices[type]
        })
      });

      const result = await res.json();

      if (result.code === 0) {
        setCurrentOrder(result.data.order);
        setShowPaymentModal(true);
      } else {
        alert('创建订单失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      alert('创建订单失败，请稍后重试');
    }
  };

  // 检查支付状态
  const checkPaymentStatus = async () => {
    if (!currentOrder) return;

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'checkOrderStatus',
          orderId: currentOrder.id
        })
      });

      const result = await res.json();
      
      if (result.code === 0) {
        const order = result.data.order;
        
        if (order.status === 'paid' || order.status === 'delivered') {
          setCurrentOrder(order);
          setShowPaymentModal(false);
          setShowSuccessModal(true);
          
          // 刷新库存
          loadShopData();
        } else {
          alert('尚未检测到付款，请确认付款后稍等片刻再试');
        }
      }
    } catch (error) {
      console.error('检查状态失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Kiro 账户商店</h1>
          <p className="text-gray-300">安全可靠的账户购买平台 · 自动发货</p>
        </div>

        {/* 商品筛选 */}
        <div className="flex justify-center space-x-2 mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-white text-gray-900 shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            全部商品
          </button>
          {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedType === type
                  ? `${ACCOUNT_TYPES[type].bgColor} ${ACCOUNT_TYPES[type].textColor} ring-2 ring-white/30`
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {ACCOUNT_TYPES[type].icon} {ACCOUNT_TYPES[type].label}
            </button>
          ))}
        </div>

        {/* 商品列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(ACCOUNT_TYPES) as AccountType[])
            .filter(type => selectedType === 'all' || selectedType === type)
            .map((type) => {
              const stock = getStockCount(type);
              const isAvailable = stock > 0;
              
              return (
                <div
                  key={type}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl ${
                    !isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  {/* 类型标识条 */}
                  <div className={`h-2 ${ACCOUNT_TYPES[type].bgColor}`} />
                  
                  <div className="p-6">
                    {/* 图标和名称 */}
                    <div className="text-center mb-4">
                      <div className={`w-16 h-16 mx-auto ${ACCOUNT_TYPES[type].bgColor} rounded-full flex items-center justify-center text-3xl mb-3`}>
                        {ACCOUNT_TYPES[type].icon}
                      </div>
                      <h2 className="text-xl font-bold text-white">{ACCOUNT_TYPES[type].label}</h2>
                    </div>

                    {/* 价格 */}
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-white">¥{prices[type]?.toFixed(2)}</span>
                      <span className="text-gray-400 text-sm ml-1">/个</span>
                    </div>

                    {/* 库存信息 */}
                    <div className="flex items-center justify-center space-x-2 mb-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        isAvailable 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
                        库存：{stock}
                      </span>
                    </div>

                    {/* 购买按钮 */}
                    <button
                      onClick={() => handleBuyNow(type)}
                      disabled={!isAvailable}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        isAvailable
                          ? `bg-gradient-to-r ${type === 'normal' ? 'from-gray-500 to-gray-600' : type === '1000i' ? 'from-blue-500 to-blue-600' : type === '2000' ? 'from-purple-500 to-purple-600' : 'from-yellow-500 to-yellow-600'} text-white hover:shadow-lg active:scale-95`
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? '立即购买' : '暂无库存'}
                    </button>
                  </div>

                  {/* 售罄标记 */}
                  {!isAvailable && (
                    <div className="absolute top-12 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded rotate-12">
                      售罄
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* 购买须知 */}
        <div className="mt-10 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">📋 购买说明</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• 下单后请使用微信扫描收款码完成付款</li>
            <li>• 付款后等待商家确认，通常 1-5 分钟内发货</li>
            <li>• 发货后页面将自动显示账户分享链接</li>
            <li>• 每个账户仅售一次，售出后自动从库存移除</li>
            <li>• 如有问题请联系客服</li>
          </ul>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPaymentModal && currentOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            {/* 头部 */}
            <div className={`${ACCOUNT_TYPES[currentOrder.accountType].bgColor} p-4 text-center`}>
              <h2 className="text-xl font-bold text-white">确认付款</h2>
            </div>

            <div className="p-6">
              {/* 商品信息 */}
              <div className="text-center mb-6">
                <div className={`inline-block ${ACCOUNT_TYPES[currentOrder.accountType].bgColor} rounded-full px-4 py-1 mb-3`}>
                  <span className={ACCOUNT_TYPES[currentOrder.accountType].textColor + ' font-medium'}>
                    {ACCOUNT_TYPES[currentOrder.accountType].label}
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  ¥{currentOrder.price.toFixed(2)}
                </div>
                <p className="text-gray-400 text-sm">订单号：{currentOrder.orderId}</p>
              </div>

              {/* 收款码 */}
              <div className="bg-white rounded-xl p-4 mb-6 text-center">
                <img 
                  src={PAYMENT_QR} 
                  alt="微信收款码" 
                  className="w-56 h-56 mx-auto object-contain"
                />
                <p className="text-gray-600 text-sm mt-3 font-medium">微信扫一扫付款</p>
                <p className="text-red-500 text-xs mt-1">⚠ 付款时请备注订单号</p>
              </div>

              {/* 提示信息 */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <p className="text-yellow-300 text-sm text-center">
                  ⏱ 付款后请点击下方按钮确认，或等待商家手动确认
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={checkPaymentStatus}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  我已完成付款
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-all"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 发货成功弹窗 */}
      {showSuccessModal && currentOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">交易成功！</h2>
            </div>

            <div className="p-6">
              {/* 分享链接 */}
              <div className="bg-black/30 rounded-xl p-4 mb-6">
                <label className="block text-gray-400 text-sm mb-2">您的账户分享链接</label>
                <div className="bg-black/40 rounded-lg p-3 break-all text-sm">
                  <span className="text-green-400 font-mono">
                    {currentOrder.shareUrl || `${window.location.origin}/kiro/share?token=xxxxx`}
                  </span>
                </div>
              </div>

              {/* 提示 */}
              <div className="text-gray-400 text-sm text-center mb-6">
                <p>📎 请复制上方链接保存</p>
                <p className="mt-1 text-xs">链接有效期：2天</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (currentOrder.shareUrl) {
                      navigator.clipboard.writeText(currentOrder.shareUrl);
                      alert('链接已复制到剪贴板！');
                    }
                  }}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all"
                >
                  📋 复制链接
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCurrentOrder(null);
                  }}
                  className="w-full py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-all"
                >
                  返回商店
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
