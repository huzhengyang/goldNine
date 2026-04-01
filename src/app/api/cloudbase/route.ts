/**
 * CloudBase API 代理路由
 * 用于绕过开发环境的跨域限制
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // CloudBase 初始化
    const cloudbase = require('@cloudbase/node-sdk');
    const app = cloudbase.init({
      env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID,
      region: process.env.NEXT_PUBLIC_CLOUDBASE_REGION
    });

    const db = app.database();

    // 根据action执行不同的操作
    let result;
    switch (action) {
      case 'getNews':
        result = await db.collection('news').get();
        break;
      case 'getVenues':
        result = await db.collection('venues').get();
        break;
      case 'getEvents':
        result = await db.collection('events').get();
        break;
      case 'getCoaches':
        result = await db.collection('coaches').get();
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('CloudBase proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // CloudBase 初始化
    const cloudbase = require('@cloudbase/node-sdk');
    const app = cloudbase.init({
      env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID,
      region: process.env.NEXT_PUBLIC_CLOUDBASE_REGION
    });

    const db = app.database();

    // 根据action执行不同的操作
    let result;
    switch (action) {
      case 'test':
        result = { message: 'CloudBase proxy is working!', env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID };
        break;
      case 'getNews':
        result = await db.collection('news').limit(10).get();
        break;
      case 'getVenues':
        result = await db.collection('venues').limit(10).get();
        break;
      case 'getEvents':
        result = await db.collection('events').limit(10).get();
        break;
      case 'getCoaches':
        result = await db.collection('coaches').limit(10).get();
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('CloudBase proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
