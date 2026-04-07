'use strict';

const crypto = require('crypto');

// 加密密钥（32字节，建议从环境变量读取）
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'goldnine-kiro-share-secret-key-32b';

// 加密函数
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.main = async (event, context) => {
  const { email, password, platform, receiveCodeUrl, twoFaCode } = event;
  
  if (!email || !password) {
    return {
      code: 400,
      message: '缺少必要参数'
    };
  }
  
  try {
    const cloudbase = require('@cloudbase/node-sdk');
    const app = cloudbase.init({
      env: context.namespace
    });
    const db = app.database();
    
    // 生成唯一 token
    const token = crypto.randomBytes(16).toString('hex');
    
    // 加密账户数据
    const accountData = JSON.stringify({
      email,
      password,
      platform: platform || 'unknown',
      receiveCodeUrl: receiveCodeUrl || '',
      twoFaCode: twoFaCode || '',
      createdAt: new Date().toISOString()
    });
    
    const encryptedData = encrypt(accountData);
    
    // 存储到数据库（有效期2天）
    await db.collection('share_tokens').add({
      token,
      data: encryptedData,
      createdAt: db.serverDate(),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      accessCount: 0
    });
    
    return {
      code: 0,
      message: 'success',
      data: { token }
    };
  } catch (error) {
    console.error('创建分享 token 失败:', error);
    return {
      code: 500,
      message: '创建分享链接失败: ' + error.message
    };
  }
};
