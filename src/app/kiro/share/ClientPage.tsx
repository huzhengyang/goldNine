'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import cloudbase from '@cloudbase/js-sdk';

interface AccountData {
  email: string;
  password: string;
  platform: string;
  receiveCodeUrl?: string;
  twoFaCode?: string;
}

export default function ShareClient() {
  const searchParams = useSearchParams();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // 使用 token 获取账户数据
      fetchAccountByToken(token);
    } else {
      // 兼容旧的明文参数方式（已废弃，仅用于过渡）
      const email = searchParams.get('email');
      const password = searchParams.get('password');
      const platform = searchParams.get('platform');
      const receiveCodeUrl = searchParams.get('receiveCodeUrl');
      const twoFaCode = searchParams.get('twoFaCode');

      if (email && password) {
        setAccount({
          email: decodeURIComponent(email),
          password: decodeURIComponent(password),
          platform: platform || 'unknown',
          receiveCodeUrl: receiveCodeUrl ? decodeURIComponent(receiveCodeUrl) : undefined,
          twoFaCode: twoFaCode ? decodeURIComponent(twoFaCode) : undefined
        });
      }
    }
  }, [searchParams]);
  
  // 通过 token 获取账户数据
  const fetchAccountByToken = async (token: string) => {
    try {
      const app = cloudbase.init({
        env: 'goldnine-hk-8g3g5ijhec9df56e'
      });
      
      // 匿名登录
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      // 调用云函数获取解密后的账户数据
      const result = await app.callFunction({
        name: 'get-share-data',
        data: { token }
      });
      
      if (result.result && result.result.code === 0 && result.result.data) {
        setAccount({
          email: result.result.data.email,
          password: result.result.data.password,
          platform: result.result.data.platform || 'unknown',
          receiveCodeUrl: result.result.data.receiveCodeUrl || undefined,
          twoFaCode: result.result.data.twoFaCode || undefined
        });
      } else {
        alert(result.result?.message || '链接无效或已过期');
      }
    } catch (error) {
      console.error('获取账户数据失败:', error);
      alert('获取账户数据失败，请检查链接是否正确');
    }
  };

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoRefresh && account?.receiveCodeUrl) {
      // 倒计时结束自动刷新
      fetchVerificationCode();
    }
  }, [countdown, autoRefresh]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} 已复制到剪贴板`);
    });
  };

  // 获取验证码（调用云函数）
  const fetchVerificationCode = async () => {
    if (!account?.receiveCodeUrl) return;
    
    setIsFetching(true);
    
    try {
      const app = cloudbase.init({
        env: 'goldnine-hk-8g3g5ijhec9df56e'
      });
      
      // 先进行匿名登录获取访问权限
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      // 调用云函数
      const result = await app.callFunction({
        name: 'get-verification-code',
        data: {
          url: account.receiveCodeUrl
        }
      });
      
      if (result.result && result.result.code === 0 && result.result.data) {
        setVerificationCode(result.result.data.code || '');
        setCountdown(result.result.data.countdown || 30);
      } else {
        alert('获取验证码失败：' + (result.result?.message || '未知错误'));
      }
    } catch (error) {
      console.error('获取验证码失败:', error);
      alert('获取验证码失败：' + (error instanceof Error ? error.message : '请稍后重试'));
    } finally {
      setIsFetching(false);
    }
  };



  const getPlatformInfo = (platform: string) => {
    const platforms: Record<string, { name: string; color: string; icon: string; description: string }> = {
      google: {
        name: 'Google',
        color: 'from-blue-500 to-green-500',
        icon: 'G',
        description: '此账户已出售给 Google，可用于登录 Google 相关服务。'
      },
      amazon: {
        name: 'Amazon',
        color: 'from-orange-500 to-yellow-500',
        icon: 'A',
        description: '此账户已出售给 Amazon，可用于登录 Amazon 相关服务。'
      },
      github: {
        name: 'GitHub',
        color: 'from-gray-700 to-gray-900',
        icon: 'GH',
        description: '此账户已出售给 GitHub，可用于登录 GitHub 相关服务。'
      }
    };
    return platforms[platform] || { name: platform, color: 'from-gray-500 to-gray-700', icon: '?', description: '此账户已出售。' };
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">链接无效</h1>
          <p className="text-gray-400">此分享链接不存在或已过期</p>
        </div>
      </div>
    );
  }

  const platformInfo = getPlatformInfo(account.platform);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-lg w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">K</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Kiro 账户分享</h1>
          <p className="text-gray-400">此账户已出售给 Kiro</p>
        </div>

        {/* Account Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-6">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3">
            <div className="flex items-center justify-center space-x-2 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">已验证</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* 邮箱账号 */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-xs text-gray-400 block mb-1">邮箱账号</label>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-lg">{account.email}</p>
                <button
                  onClick={() => copyToClipboard(account.email, '邮箱账号')}
                  className="p-2 text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 账号密码 */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-xs text-gray-400 block mb-1">账号密码</label>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-lg">{account.password}</p>
                <button
                  onClick={() => copyToClipboard(account.password, '账号密码')}
                  className="p-2 text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 验证码卡片 */}
        {account.receiveCodeUrl && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3">
              <div className="flex items-center justify-center space-x-2 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-semibold">短信验证码</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* 验证码显示 */}
              {verificationCode ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <label className="text-xs text-gray-400 block mb-2">当前验证码</label>
                    <div className="text-5xl font-mono font-bold text-green-300 mb-3 tracking-wider">
                      {verificationCode}
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      {/* 倒计时 */}
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={countdown < 10 ? 'text-red-400 font-semibold' : ''}>
                          {countdown}秒后刷新
                        </span>
                      </div>
                      {/* 复制按钮 */}
                      <button
                        onClick={() => copyToClipboard(verificationCode, '验证码')}
                        className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>复制</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-gray-400 mb-3">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-sm">点击下方按钮获取验证码</p>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span>自动刷新</span>
                </label>
                <button
                  onClick={fetchVerificationCode}
                  disabled={isFetching || countdown > 0}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 transition-colors ${
                    isFetching || countdown > 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {isFetching ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>获取中...</span>
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <span>请等待 {countdown}s</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>获取验证码</span>
                    </>
                  )}
                </button>
              </div>

              {/* 提示 */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-purple-300 text-xs">
                    点击"打开"按钮查看接码页面获取验证码，或点击"获取验证码"自动刷新
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 说明 */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
              <div>
                <h3 className="text-blue-300 font-semibold text-sm mb-1">使用说明</h3>
                <p className="text-gray-300 text-sm">此账户已出售，可用于登录相关服务。</p>
              </div>
          </div>
        </div>

        {/* 质保说明 */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="text-red-300 font-semibold text-sm mb-2">试用号550积分质保方案</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <p>1. 稳定版发账号密码登录，需支持谷歌环境登录</p>
                <p>2. 质保2天，以下单为准。如果质保期2天内被封只可以换一次账号，换的新号无质保，超过2天后无论有没有使用积分或者有没有登录账号，质保完成！</p>
                <p>3. 试用号不支持opus4.6模型，官方新增每日限额、每月限额！高峰期限速</p>
                <p className="font-semibold text-red-300 mt-3">说明：发货后不支持退款，不会登录、嫌麻烦、官方限速、官方限额、too many等各种理由进行退款！对自己的诚信负责！无诚信的人请勿下单，同意质保方案再下单，如果下单代表同意</p>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-yellow-300 font-semibold text-sm mb-1">注意事项</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 请妥善保管账户信息，不要泄露给他人</li>
                <li>• 首次登录后请及时修改密码</li>
                <li>• 验证码有效期通常为60秒，请及时使用</li>
                <li>• 如遇问题请联系客服处理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>分享时间：{new Date().toLocaleString('zh-CN')}</p>
          <p className="mt-1">此链接仅供查看，请勿传播</p>
        </div>
      </div>
    </div>
  );
}
