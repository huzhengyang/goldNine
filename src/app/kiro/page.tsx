'use client';

import { useState, useEffect } from 'react';
import cloudbase from '@cloudbase/js-sdk';

// 登录账户
const LOGIN_ACCOUNT = {
  username: 'huzhengyang',
  password: 'Fxr880524'
};

interface KiroAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  receiveCodeUrl: string;
  twoFaCode: string;
  backupEmail: string;
  createdAt: string;
  accountType?: 'normal' | '1000i' | '2000' | '10000'; // 账户类型
  googleSold?: boolean;
  amazonSold?: boolean;
  githubSold?: boolean;
  githubRegistered?: boolean; // GitHub注册状态
  githubUsername?: string; // GitHub用户名
}

// 账户类型配置
const ACCOUNT_TYPES = {
  normal: { label: '普通账户', color: 'gray', bgColor: 'bg-gray-500/30', textColor: 'text-gray-300', borderColor: 'border-gray-500/50', icon: '📦' },
  '1000i': { label: '1000i积分', color: 'blue', bgColor: 'bg-blue-500/30', textColor: 'text-blue-300', borderColor: 'border-blue-500/50', icon: '💎' },
  '2000': { label: '2000计分', color: 'purple', bgColor: 'bg-purple-500/30', textColor: 'text-purple-300', borderColor: 'border-purple-500/50', icon: '🔮' },
  '10000': { label: '10000计分', color: 'yellow', bgColor: 'bg-yellow-500/30', textColor: 'text-yellow-300', borderColor: 'border-yellow-500/50', icon: '⭐' }
} as const;

type AccountType = keyof typeof ACCOUNT_TYPES;

const STORAGE_KEY = 'kiro_accounts';

// 默认账户
const DEFAULT_ACCOUNTS: KiroAccount[] = [
  {
    id: '1',
    name: '账户 1',
    email: 'HagmannKoiner@gmail.com',
    password: 'pgaptswgk',
    receiveCodeUrl: 'https://2fa.show/2fa/dwnmfqrcdibjrolxa23rxe4ctjmefr4t',
    twoFaCode: 'dwnmfqrcdibjrolxa23rxe4ctjmefr4t',
    backupEmail: 'padroslaadc@hotmail.com',
    createdAt: '2026-04-03',
    accountType: 'normal'
  },
  {
    id: '2',
    name: '账户 2',
    email: 'ValarieSchwebel@gmail.com',
    password: 'rfxhsvhll',
    receiveCodeUrl: 'https://2fa.show/2fa/lcjflajs32zbzqbr4hjj2yswqxolmv5k',
    twoFaCode: 'lcjflajs32zbzqbr4hjj2yswqxolmv5k',
    backupEmail: 'eelikakadiaz@hotmail.com',
    createdAt: '2026-04-04',
    accountType: '1000i'
  },
  {
    id: '3',
    name: '账户 3',
    email: 'MurozukaTatsubuchi@gmail.com',
    password: 'amfeh4vgj',
    receiveCodeUrl: 'https://2fa.show/2fa/rdfqc6qmrosratjsjubrvlflny7jsh6p',
    twoFaCode: 'rdfqc6qmrosratjsjubrvlflny7jsh6p',
    backupEmail: 'pavelkapfeifleek366@yahoo.com',
    createdAt: '2026-04-04',
    accountType: '2000'
  }
];

export default function KiroManagementPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accounts, setAccounts] = useState<KiroAccount[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<KiroAccount | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [filterType, setFilterType] = useState<AccountType | 'all'>('all'); // 类型筛选
  const [shopPrices, setShopPrices] = useState<Record<string, number>>({ // 商店价格配置
    normal: 9.9,
    '1000i': 19.9,
    '2000': 29.9,
    '10000': 49.9
  } as Record<string, number>);
  const [showPricePanel, setShowPricePanel] = useState(false); // 显示价格面板
  const [showOrderPanel, setShowOrderPanel] = useState(false); // 显示订单面板
  const [orders, setOrders] = useState<any[]>([]); // 订单列表
  const [orderFilter, setOrderFilter] = useState<string>('pending'); // 订单筛选

  // 新账户表单
  const [formData, setFormData] = useState<Partial<KiroAccount> & { accountType?: AccountType }>({
    name: '',
    email: '',
    password: '',
    receiveCodeUrl: '',
    twoFaCode: '',
    backupEmail: '',
    accountType: 'normal'
  });

  // 加载数据 (云端同步)
  useEffect(() => {
    if (isLoggedIn) {
      loadAccountsFromCloud();
      loadShopPrices();
    }
  }, [isLoggedIn]);

  // 从云端加载账户
  const loadAccountsFromCloud = async () => {
    try {
      const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      const result = await app.callFunction({
        name: 'account-manager',
        data: { action: 'get' }
      });
      
      if (result.result && result.result.code === 0) {
        const accs = result.result.data || [];
        if (accs.length > 0) {
          setAccounts(accs);
          syncAccountsToShop(accs);
        }
        // 云端返回空数组时，保持当前状态，不覆盖
      } else {
        console.error('云端返回错误:', result.result);
      }
    } catch (error) {
      console.error('加载云端数据失败:', error);
      // 加载失败时不覆盖数据，保持空状态
    }
  };

  // 同步账户数据到商店API
  const syncAccountsToShop = async (accs: KiroAccount[]) => {
    try {
      await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'syncAccounts', accounts: accs })
      });
    } catch (error) {
      console.error('同步账户失败:', error);
    }
  };

  // 保存到云端
  const saveToCloud = async (accs: KiroAccount[]) => {
    try {
      const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      const result = await app.callFunction({
        name: 'account-manager',
        data: { action: 'save', accounts: accs }
      });

      if (!result.result || result.result.code !== 0) {
        console.error('云端保存失败:', result.result);
        alert('⚠️ 云端保存失败：' + (result.result?.message || '未知错误'));
      }
    } catch (error) {
      console.error('保存云端数据失败:', error);
      alert('⚠️ 云端保存失败：' + (error instanceof Error ? error.message : '请稍后重试'));
    }
  };

  // 加载商店价格配置
  const loadShopPrices = async () => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getPrices' })
      });

      const result = await res.json();
      
      if (result.code === 0 && result.data) {
        setShopPrices(result.data);
      }
    } catch (error) {
      console.error('加载价格配置失败:', error);
    }
  };

  // 保存商店价格配置
  const saveShopPrices = async (newPrices: Record<string, number>) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'savePrices', prices: newPrices })
      });

      const result = await res.json();

      if (result.code === 0) {
        setShopPrices(newPrices);
        alert('价格已保存！');
      } else {
        alert(result.message || '保存失败');
      }
    } catch (error) {
      console.error('保存价格失败:', error);
      alert('保存价格失败');
    }
  };

  // 加载订单列表
  const loadOrders = async (status?: string) => {
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getOrders', status, limit: 50 })
      });

      const result = await res.json();

      if (result.code === 0) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('加载订单失败:', error);
    }
  };

  // 确认收款并发货
  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm('确认该订单已付款？确认后将自动发货。')) return;

    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirmPayment', orderId })
      });

      const result = await res.json();

      if (result.code === 0) {
        alert('✓ 发货成功！');
        loadOrders(orderFilter);
        loadAccountsFromCloud(); // 刷新账户库存
      } else {
        alert('操作失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('确认订单失败:', error);
      alert('操作失败');
    }
  };

  // 显示/隐藏订单面板时加载数据
  useEffect(() => {
    if (showOrderPanel) {
      loadOrders(orderFilter);
    }
  }, [showOrderPanel, orderFilter]);

  // 保存数据 (同时保存到云端和本地)
  const saveAccounts = (newAccounts: KiroAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccounts));
    saveToCloud(newAccounts);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === LOGIN_ACCOUNT.username && password === LOGIN_ACCOUNT.password) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} 已复制到剪贴板`);
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 添加账户
  const handleAddAccount = () => {
    if (!formData.email || !formData.password) {
      alert('请填写邮箱和密码');
      return;
    }
    
    const newAccount: KiroAccount = {
      id: Date.now().toString(),
      name: formData.name || `账户 ${accounts.length + 1}`,
      email: formData.email || '',
      password: formData.password || '',
      receiveCodeUrl: formData.receiveCodeUrl || '',
      twoFaCode: formData.twoFaCode || '',
      backupEmail: formData.backupEmail || '',
      createdAt: new Date().toISOString().split('T')[0],
      accountType: formData.accountType || 'normal'
    };
    
    saveAccounts([...accounts, newAccount]);
    setFormData({ name: '', email: '', password: '', receiveCodeUrl: '', twoFaCode: '', backupEmail: '', accountType: 'normal' });
    setIsAddingNew(false);
    setShowAddModal(false);
  };

  // 解析粘贴文本
  const handleParsePasteText = () => {
    const lines = pasteText.split('\n');
    const data: Partial<KiroAccount> = {};
    
    lines.forEach(line => {
      const colonIndex = line.indexOf('：');
      if (colonIndex === -1) return;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      if (key.includes('油箱') || key.includes('邮箱') || key.toLowerCase().includes('email')) {
        data.email = value;
      } else if (key.includes('密码')) {
        data.password = value;
      } else if (key.includes('接码') || key.includes('URL')) {
        data.receiveCodeUrl = value;
      } else if (key.includes('2fa') || key.includes('2FA')) {
        data.twoFaCode = value;
      } else if (key.includes('辅助')) {
        data.backupEmail = value;
      }
    });
    
    setFormData({ ...formData, ...data });
    setPasteText('');
  };

  // 编辑账户
  const handleEditAccount = () => {
    if (!editingAccount || !formData.email) {
      alert('请填写邮箱');
      return;
    }
    
    const updated = accounts.map(acc => 
      acc.id === editingAccount.id 
        ? { ...acc, ...formData }
        : acc
    );
    
    saveAccounts(updated);
    setEditingAccount(null);
    setFormData({ name: '', email: '', password: '', receiveCodeUrl: '', twoFaCode: '', backupEmail: '', accountType: 'normal' });
  };

  // 删除账户
  const handleDeleteAccount = (id: string) => {
    if (confirm('确定要删除这个账户吗？')) {
      saveAccounts(accounts.filter(acc => acc.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  // 开始编辑
  const startEdit = (account: KiroAccount) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      email: account.email,
      password: account.password,
      receiveCodeUrl: account.receiveCodeUrl,
      twoFaCode: account.twoFaCode,
      backupEmail: account.backupEmail,
      accountType: account.accountType || 'normal'
    });
  };

  // 复制分享链接（加密版本）
  const copyShareLink = async (account: KiroAccount, platform: 'google' | 'amazon' | 'github') => {
    try {
      // 初始化 CloudBase
      const app = cloudbase.init({
        env: 'goldnine-hk-8g3g5ijhec9df56e'
      });
      
      // 匿名登录
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      // 调用云函数创建 token
      const result = await app.callFunction({
        name: 'create-share-token',
        data: {
          email: account.email,
          password: account.password,
          platform: platform,
          receiveCodeUrl: account.receiveCodeUrl || '',
          twoFaCode: account.twoFaCode || ''
        }
      });
      
      if (result.result && result.result.code === 0 && result.result.data) {
        const shareUrl = `${window.location.origin}/kiro/share?token=${result.result.data.token}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('分享链接已复制到剪贴板！\n\n链接有效期：2天\n' + shareUrl);
      } else {
        alert('生成分享链接失败：' + (result.result?.message || '未知错误'));
      }
    } catch (error) {
      console.error('创建分享链接失败:', error);
      alert('创建分享链接失败：' + (error instanceof Error ? error.message : '请稍后重试'));
    }
  };

  // 出售账户
  const handleSell = (accountId: string, platform: 'google' | 'amazon' | 'github') => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    // 更新状态
    const updated = accounts.map(acc => {
      if (acc.id === accountId) {
        if (platform === 'google') return { ...acc, googleSold: true };
        if (platform === 'amazon') return { ...acc, amazonSold: true };
        if (platform === 'github') return { ...acc, githubSold: true };
      }
      return acc;
    });
    saveAccounts(updated);
    
    // 直接复制分享链接
    copyShareLink(account, platform);
  };

  // 注册GitHub账户
  const handleRegisterGitHub = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    if (!account.email || !account.password) {
      alert('缺少邮箱或密码信息');
      return;
    }
    
    if (!account.receiveCodeUrl) {
      alert('缺少接码地址，无法获取验证码');
      return;
    }
    
    try {
      // 初始化 CloudBase
      const app = cloudbase.init({
        env: 'goldnine-hk-8g3g5ijhec9df56e'
      });
      
      // 匿名登录
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      // 创建注册任务
      const result = await app.callFunction({
        name: 'github-register-task',
        data: {
          action: 'addTask',
          accountId: account.id,
          email: account.email,
          password: account.password,
          receiveCodeUrl: account.receiveCodeUrl
        }
      });
      
      if (result.result && result.result.code === 0) {
        const taskId = result.result.data.taskId;
        
        alert(
          '✓ 注册任务已创建！\n\n' +
          '请在本地启动注册服务：\n' +
          '1. 打开终端，进入 goldnine/scripts 目录\n' +
          '2. 运行: node poll-service.js\n' +
          '3. 服务会自动处理注册\n\n' +
          '任务ID: ' + taskId + '\n\n' +
          '注册成功后会自动更新状态'
        );
        
        // 开始轮询任务状态
        pollTaskStatus(taskId, account.id);
      } else {
        alert('创建任务失败：' + (result.result?.message || '未知错误'));
      }
    } catch (error) {
      console.error('创建注册任务失败:', error);
      alert('创建任务失败：' + (error instanceof Error ? error.message : '请稍后重试'));
    }
  };
  
  // 初始化数据库集合
  const initDatabase = async () => {
    try {
      const app = cloudbase.init({
        env: 'goldnine-hk-8g3g5ijhec9df56e'
      });
      
      const auth = app.auth();
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      
      const result = await app.callFunction({
        name: 'init-collection'
      });
      
      if (result.result && result.result.code === 0) {
        alert('✓ 数据库初始化成功！\n\n现在可以正常使用 GitHub 注册功能了。');
      } else {
        alert('初始化失败：' + (result.result?.message || '未知错误'));
      }
    } catch (error) {
      console.error('初始化失败:', error);
      alert('初始化失败：' + (error instanceof Error ? error.message : '请稍后重试'));
    }
  };
  
  // 轮询任务状态
  const pollTaskStatus = async (taskId: string, accountId: string) => {
    const maxAttempts = 120; // 最多轮询10分钟（每5秒一次）
    let attempts = 0;
    
    const poll = async () => {
      try {
        const app = cloudbase.init({
          env: 'goldnine-hk-8g3g5ijhec9df56e'
        });
        
        const result = await app.callFunction({
          name: 'github-register-task',
          data: {
            action: 'getStatus',
            taskId
          }
        });
        
        if (result.result && result.result.code === 0) {
          const task = result.result.data;
          
          if (task.status === 'completed' && task.result?.success) {
            // 注册成功，更新状态
            const updated = accounts.map(acc => {
              if (acc.id === accountId) {
                return {
                  ...acc,
                  githubRegistered: true,
                  githubUsername: task.result.githubUsername
                };
              }
              return acc;
            });
            saveAccounts(updated);
            alert('✓ GitHub注册成功！\n用户名: ' + task.result.githubUsername);
            return;
          } else if (task.status === 'failed') {
            alert('✗ 注册失败：' + (task.result?.error || task.result?.message || '未知错误'));
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // 5秒后再轮询
        }
      } catch (error) {
        console.error('轮询状态失败:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        }
      }
    };
    
    // 开始轮询
    setTimeout(poll, 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Kiro账户管理</h1>
              <p className="text-gray-300">请登录以查看账户信息</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                登录
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Kiro账户管理</h1>
                <p className="text-gray-300 text-sm">共 {accounts.length} 个账户</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* 商店入口按钮 */}
              <a
                href="/kiro/shop"
                target="_blank"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>打开商店</span>
              </a>

              {/* 价格设置按钮 */}
              <button
                onClick={() => setShowPricePanel(!showPricePanel)}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center space-x-2 ${
                  showPricePanel 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>价格设置</span>
              </button>

              {/* 类型筛选按钮组 */}
              <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  全部
                </button>
                {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === type ? ACCOUNT_TYPES[type].bgColor + ' ' + ACCOUNT_TYPES[type].textColor + ' font-medium' : 'text-gray-300 hover:text-white'}`}
                  >
                    {ACCOUNT_TYPES[type].label}
                  </button>
                ))}
              </div>
              <button
                onClick={initDatabase}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>初始化数据库</span>
              </button>
              <button
                onClick={() => {
                  setFormData({ name: '', email: '', password: '', receiveCodeUrl: '', twoFaCode: '', backupEmail: '', accountType: 'normal' });
                  setIsAddingNew(true);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>添加账户</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                退出登录
              </button>

              {/* 订单管理按钮 */}
              <button
                onClick={() => { setShowOrderPanel(!showOrderPanel); setShowPricePanel(false); }}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center space-x-2 ${
                  showOrderPanel 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>订单管理</span>
                {/* 待处理订单数量提示 */}
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">!</span>
              </button>
            </div>
          </div>
        </div>

        {/* 价格设置面板 */}
        {showPricePanel && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>商品价格设置</span>
              </h2>
              <button
                onClick={() => setShowPricePanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
                <div key={type} className={`bg-white/5 rounded-xl p-4 ${ACCOUNT_TYPES[type].borderColor} border`}>
                  <label className={`block text-sm font-medium ${ACCOUNT_TYPES[type].textColor} mb-2`}>
                    {ACCOUNT_TYPES[type].icon} {ACCOUNT_TYPES[type].label}
                  </label>
                  <div className="flex items-center">
                    <span className="text-white mr-2">¥</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={shopPrices[type] || 0}
                      onChange={(e) => setShopPrices({ ...shopPrices, [type]: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* 库存显示 */}
                  <p className="text-xs text-gray-400 mt-2">
                    库存：{accounts.filter(a => a.accountType === type && !a.googleSold && !a.amazonSold && !a.githubSold).length} 个
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => saveShopPrices(shopPrices)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>保存价格</span>
              </button>
            </div>
          </div>
        )}

        {/* 订单管理面板 */}
        {showOrderPanel && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>订单管理</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                  orderFilter === 'pending' ? 'bg-red-500/30 text-red-300' :
                  orderFilter === 'delivered' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'
                }`}>
                  {orders.length} 条
                </span>
              </h2>
              <button
                onClick={() => setShowOrderPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 订单筛选 */}
            <div className="flex space-x-2 mb-4">
              {[
                { key: 'pending', label: '待处理' },
                { key: 'delivered', label: '已完成' },
                { key: '', label: '全部' }
              ].map((item) => (
                <button
                  key={item.key || 'all'}
                  onClick={() => setOrderFilter(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    orderFilter === item.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 订单列表 */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  暂无订单
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{order.orderId}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {order.status === 'pending' ? '待付款' : 
                             order.status === 'delivered' ? '已发货' : order.status}
                          </span>
                          {order.accountType && (
                            <span className={`px-2 py-0.5 rounded text-xs ${ACCOUNT_TYPES[order.accountType as AccountType]?.bgColor || 'bg-gray-500/30'} ${ACCOUNT_TYPES[order.accountType as AccountType]?.textColor || 'text-gray-300'}`}>
                              {ACCOUNT_TYPES[order.accountType as AccountType]?.label || order.accountType}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 space-x-3">
                          <span>¥{order.price?.toFixed(2)}</span>
                          <span>{order.accountEmail}</span>
                          <span>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2 ml-4">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                              确认收款
                            </button>
                          </>
                        )}
                        {order.status === 'delivered' && order.shareUrl && (
                          <button
                            onClick={() => navigator.clipboard.writeText(order.shareUrl)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            复制链接
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || editingAccount) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingAccount ? '编辑账户' : '添加新账户'}
                </h2>
                <button
                  onClick={() => {
                    setEditingAccount(null);
                    setShowAddModal(false);
                    setFormData({ name: '', email: '', password: '', receiveCodeUrl: '', twoFaCode: '', backupEmail: '', accountType: 'normal' });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Paste Text Area */}
              <div className="mb-4 bg-white/5 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">粘贴账户信息（自动解析）</label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  placeholder="粘贴格式如：
油箱账号：xxx@gmail.com
账号密码：xxx
接码URL：xxx
2fa码：xxx
辅助油箱：xxx"
                />
                <button
                  onClick={handleParsePasteText}
                  className="mt-2 px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                >
                  解析并填充
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">账户类型</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: type })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.accountType === type
                            ? ACCOUNT_TYPES[type].bgColor + ' ' + ACCOUNT_TYPES[type].textColor + ' ring-2 ring-white/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/10'
                        }`}
                      >
                        {ACCOUNT_TYPES[type].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">账户名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="账户名称（如：账户 1）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">邮箱账号 *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="xxx@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">账号密码 *</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">接码URL</label>
                  <input
                    type="url"
                    value={formData.receiveCodeUrl}
                    onChange={(e) => setFormData({ ...formData, receiveCodeUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://2fa.show/2fa/xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">2FA码</label>
                  <input
                    type="text"
                    value={formData.twoFaCode}
                    onChange={(e) => setFormData({ ...formData, twoFaCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2FA码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">辅助邮箱</label>
                  <input
                    type="email"
                    value={formData.backupEmail}
                    onChange={(e) => setFormData({ ...formData, backupEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="backup@hotmail.com"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditingAccount(null);
                    setShowAddModal(false);
                    setFormData({ name: '', email: '', password: '', receiveCodeUrl: '', twoFaCode: '', backupEmail: '', accountType: 'normal' });
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={editingAccount ? handleEditAccount : handleAddAccount}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingAccount ? '保存修改' : '添加账户'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account List */}
        <div className="space-y-3">
          {(() => {
            // 根据筛选条件过滤账户
            const filteredAccounts = filterType === 'all' 
              ? accounts 
              : accounts.filter(acc => acc.accountType === filterType);

            if (filteredAccounts.length === 0) {
              return (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-12 border border-white/20 text-center">
                  <p className="text-gray-400">
                    {accounts.length === 0 
                      ? '暂无账户，点击"添加账户"按钮创建' 
                      : `暂无"${filterType === 'all' ? '全部' : ACCOUNT_TYPES[filterType]?.label}"类型的账户`}
                  </p>
                </div>
              );
            }

            return filteredAccounts.map((account) => (
              <div 
                key={account.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Card Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleExpand(account.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {account.name.replace('账户 ', '')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                          {/* 账户类型标签 */}
                          {account.accountType && account.accountType !== 'normal' && (
                            <span className={`px-2 py-0.5 ${ACCOUNT_TYPES[account.accountType].bgColor} ${ACCOUNT_TYPES[account.accountType].textColor} rounded text-xs font-medium`}>
                              {ACCOUNT_TYPES[account.accountType].label}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">{account.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* 状态标签 */}
                      <div className="flex items-center space-x-1 flex-wrap">
                        {account.githubRegistered && (
                          <span className="px-2 py-0.5 bg-green-500/30 text-green-300 rounded text-xs">GitHub已注册</span>
                        )}
                        {account.googleSold && (
                          <span className="px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded text-xs">Google已卖</span>
                        )}
                        {account.amazonSold && (
                          <span className="px-2 py-0.5 bg-orange-500/30 text-orange-300 rounded text-xs">Amazon已卖</span>
                        )}
                        {account.githubSold && (
                          <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded text-xs">GitHub已卖</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">{account.createdAt}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === account.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                {expandedId === account.id && (
                  <div className="border-t border-white/10 p-4 space-y-3 bg-black/10">
                    {/* 邮箱账号 */}
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <label className="text-xs text-gray-400">邮箱账号</label>
                        <p className="text-white font-mono">{account.email}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(account.email, '邮箱账号'); }}
                        className="p-2 text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* 账号密码 */}
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <label className="text-xs text-gray-400">账号密码</label>
                        <p className="text-white font-mono">{account.password}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(account.password, '账号密码'); }}
                        className="p-2 text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* 接码URL */}
                    {account.receiveCodeUrl && (
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex-1">
                          <label className="text-xs text-gray-400">接码URL</label>
                          <a 
                            href={account.receiveCodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:underline break-all text-sm block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {account.receiveCodeUrl}
                          </a>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(account.receiveCodeUrl, '接码URL'); }}
                            className="p-2 text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <a
                            href={account.receiveCodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-green-300 hover:bg-green-500/20 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* 2FA码 */}
                    {account.twoFaCode && (
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div>
                          <label className="text-xs text-gray-400">2FA码</label>
                          <p className="text-yellow-300 font-mono">{account.twoFaCode}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(account.twoFaCode, '2FA码'); }}
                          className="p-2 text-yellow-300 hover:bg-yellow-500/20 rounded transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* 辅助邮箱 */}
                    {account.backupEmail && (
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div>
                          <label className="text-xs text-gray-400">辅助邮箱</label>
                          <p className="text-white font-mono">{account.backupEmail}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(account.backupEmail, '辅助邮箱'); }}
                          className="p-2 text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* GitHub注册状态 */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <label className="text-xs text-gray-400 mb-2 block">GitHub注册</label>
                      {account.githubRegistered ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-xs flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            已注册
                          </span>
                          {account.githubUsername && (
                            <span className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs">
                              用户名: {account.githubUsername}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRegisterGitHub(account.id); }}
                          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-800 transition-colors text-sm flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>注册 GitHub</span>
                        </button>
                      )}
                    </div>

                    {/* 出售状态 */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <label className="text-xs text-gray-400 mb-2 block">出售状态</label>
                      <div className="flex flex-wrap gap-2">
                        {/* Google */}
                        {account.googleSold ? (
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-gray-500/30 text-gray-300 rounded-full text-xs flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              Google - 已卖
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyShareLink(account, 'google'); }}
                              className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full text-xs hover:bg-green-500/30 transition-colors flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              分享链接
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSell(account.id, 'google'); }}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-full text-xs hover:bg-blue-500/30 transition-colors"
                          >
                            出售到 Google
                          </button>
                        )}
                        
                        {/* Amazon */}
                        {account.amazonSold ? (
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-gray-500/30 text-gray-300 rounded-full text-xs flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              Amazon - 已卖
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyShareLink(account, 'amazon'); }}
                              className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full text-xs hover:bg-green-500/30 transition-colors flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              分享链接
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSell(account.id, 'amazon'); }}
                            className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 text-orange-300 rounded-full text-xs hover:bg-orange-500/30 transition-colors"
                          >
                            出售到 Amazon
                          </button>
                        )}
                        
                        {/* GitHub */}
                        {account.githubSold ? (
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-gray-500/30 text-gray-300 rounded-full text-xs flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              GitHub - 已卖
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyShareLink(account, 'github'); }}
                              className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full text-xs hover:bg-green-500/30 transition-colors flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              分享链接
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSell(account.id, 'github'); }}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-full text-xs hover:bg-purple-500/30 transition-colors"
                          >
                            出售到 GitHub
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(account); }}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        编辑
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAccount(account.id); }}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          })()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>数据保存在浏览器本地存储中，清除浏览器缓存会丢失数据</p>
        </div>
      </div>
    </div>
  );
}
