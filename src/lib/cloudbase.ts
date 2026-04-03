import cloudbase from '@cloudbase/js-sdk';

// 初始化 CloudBase SDK
export const app = cloudbase.init({
  env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID || 'bluetooth-website-3eyhlocfe7b405'
});

// 获取数据库引用
export const db = app.database();

// 匿名登录（如果未登录）
export async function ensureAuth() {
  const auth = app.auth();
  const loginState = await auth.getLoginState();
  
  if (!loginState) {
    await auth.signInAnonymously();
    console.log('匿名登录成功');
  }
  
  return auth;
}

// 新闻集合
export const newsCollection = db.collection('news');

// 球房集合
export const venuesCollection = db.collection('venues');

// 赛事集合
export const eventsCollection = db.collection('events');

// 教练集合
export const coachesCollection = db.collection('coaches');
