'use strict';

const crypto = require('crypto');

// 解密密钥（需与加密时一致）
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'goldnine-kiro-share-secret-key-32b';

// 解密函数
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

exports.main = async (event, context) => {
  const { token } = event;
  
  if (!token) {
    return {
      code: 400,
      message: '缺少 token 参数'
    };
  }
  
  try {
    const cloudbase = require('@cloudbase/node-sdk');
    const app = cloudbase.init({
      env: context.namespace
    });
    const db = app.database();
    
    // 查询 token
    const result = await db.collection('share_tokens')
      .where({
        token,
        expiresAt: db.command.gt(new Date())
      })
      .limit(1)
      .get();
    
    if (!result.data || result.data.length === 0) {
      return {
        code: 404,
        message: '链接不存在或已过期'
      };
    }
    
    const record = result.data[0];
    
    // 解密数据
    const accountData = JSON.parse(decrypt(record.data));
    
    // 更新访问次数
    await db.collection('share_tokens')
      .doc(record._id)
      .update({
        accessCount: db.command.inc(1),
        lastAccessAt: db.serverDate()
      });
    
    return {
      code: 0,
      message: 'success',
      data: accountData
    };
  } catch (error) {
    console.error('获取分享数据失败:', error);
    return {
      code: 500,
      message: '获取分享数据失败: ' + error.message
    };
  }
};
