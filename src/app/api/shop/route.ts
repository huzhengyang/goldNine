import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const ENV_ID = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID || 'goldnine-hk-8g3g5ijhec9df56e';

// 内存缓存账户（由管理页面 syncAccounts 同步过来）
let accountsStore: any[] = [];

async function callShopManager(data: Record<string, any>) {
  const cloudbase = await import('@cloudbase/node-sdk');
  const app = (cloudbase.default || cloudbase).init({
    env: ENV_ID,
    secretId: process.env.CLOUDBASE_SECRET_ID,
    secretKey: process.env.CLOUDBASE_SECRET_KEY,
  });
  const result = await app.callFunction({
    name: 'shop-manager',
    data,
  });
  return result.result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // syncAccounts 只在内存处理，不需要云函数
    if (action === 'syncAccounts') {
      if (Array.isArray(body.accounts)) {
        accountsStore = body.accounts;
      }
      return NextResponse.json({ code: 0, message: '同步成功', count: accountsStore.length });
    }

    if (action === 'getAccounts') {
      return NextResponse.json({ code: 0, data: accountsStore });
    }

    // 其余操作全部转发给 shop-manager 云函数
    const result = await callShopManager(body);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Shop API error:', error);
    return NextResponse.json(
      { code: -1, message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await callShopManager({ action: 'getPrices' });
    return NextResponse.json({ code: 0, message: 'Shop API is running', prices: result?.data });
  } catch {
    return NextResponse.json({ code: 0, message: 'Shop API is running' });
  }
}
