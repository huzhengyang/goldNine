/**
 * 认证 API 路由
 * 处理用户登录、注册、获取用户信息等操作
 */

import { NextRequest, NextResponse } from 'next/server';

// 初始化 CloudBase
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init({
  env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID,
  region: process.env.NEXT_PUBLIC_CLOUDBASE_REGION
});

const db = app.database();

/**
 * POST - 用户登录/注册
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, code, nickname, avatar } = body;

    switch (action) {
      case 'login': {
        // 手机号验证码登录
        if (!phone || !code) {
          return NextResponse.json(
            { error: '手机号和验证码不能为空' },
            { status: 400 }
          );
        }

        // TODO: 验证验证码（需要开通短信服务）
        // 这里暂时简化处理，实际生产环境需要验证
        
        // 查询用户是否存在
        const userResult = await db.collection('users').where({ phone }).get();
        
        let user;
        if (userResult.data.length === 0) {
          // 新用户，自动注册
          const newUser = {
            phone,
            nickname: nickname || `用户${phone.slice(-4)}`,
            avatar: avatar || '',
            gender: '保密',
            age: 0,
            city: '',
            bio: '',
            level: '青铜',
            points: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const result = await db.collection('users').add(newUser);
          user = { ...newUser, _id: result.id };
        } else {
          // 老用户
          user = userResult.data[0];
        }

        return NextResponse.json({
          success: true,
          user,
          message: '登录成功'
        });
      }

      case 'updateProfile': {
        // 更新用户信息
        const { userId, updates } = body;
        
        if (!userId) {
          return NextResponse.json(
            { error: '用户ID不能为空' },
            { status: 400 }
          );
        }

        await db.collection('users').doc(userId).update({
          ...updates,
          updatedAt: new Date()
        });

        const updatedUser = await db.collection('users').doc(userId).get();

        return NextResponse.json({
          success: true,
          user: updatedUser.data[0],
          message: '更新成功'
        });
      }

      default:
        return NextResponse.json(
          { error: '未知操作' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * GET - 获取用户信息
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'getUser': {
        if (!userId) {
          return NextResponse.json(
            { error: '用户ID不能为空' },
            { status: 400 }
          );
        }

        const result = await db.collection('users').doc(userId).get();

        if (result.data.length === 0) {
          return NextResponse.json(
            { error: '用户不存在' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          user: result.data[0]
        });
      }

      case 'checkPhone': {
        const phone = searchParams.get('phone');
        
        if (!phone) {
          return NextResponse.json(
            { error: '手机号不能为空' },
            { status: 400 }
          );
        }

        const result = await db.collection('users').where({ phone }).get();

        return NextResponse.json({
          success: true,
          exists: result.data.length > 0,
          count: result.data.length
        });
      }

      default:
        return NextResponse.json(
          { error: '未知操作' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
