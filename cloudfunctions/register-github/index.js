'use strict';

const https = require('https');
const http = require('http');

// 从接码URL获取验证码
async function fetchVerificationCode(receiveCodeUrl) {
  return new Promise((resolve, reject) => {
    const client = receiveCodeUrl.startsWith('https') ? https : http;
    
    client.get(receiveCodeUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // 尝试解析页面内容，提取验证码
          // 常见格式：<div class="code">123456</div> 或类似
          const codeMatch = data.match(/(\d{6})/);
          if (codeMatch) {
            resolve(codeMatch[1]);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

exports.main = async (event, context) => {
  const { email, password, receiveCodeUrl } = event;
  
  if (!email || !password) {
    return {
      code: 400,
      message: '缺少邮箱或密码'
    };
  }
  
  try {
    // 生成GitHub用户名（基于邮箱前缀）
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 获取验证码
    let verificationCode = null;
    if (receiveCodeUrl) {
      try {
        verificationCode = await fetchVerificationCode(receiveCodeUrl);
      } catch (error) {
        console.error('获取验证码失败:', error);
      }
    }
    
    // 注意：实际的GitHub注册需要在浏览器中完成
    // 这里返回需要的信息，让前端或本地脚本完成注册
    
    return {
      code: 0,
      message: '准备就绪',
      data: {
        username,
        email,
        password,
        verificationCode,
        registerUrl: 'https://github.com/signup',
        steps: [
          '1. 打开 https://github.com/signup',
          '2. 输入邮箱: ' + email,
          '3. 输入密码: ' + password,
          '4. 输入用户名: ' + username,
          verificationCode ? '5. 输入验证码: ' + verificationCode : '5. 从接码页面获取验证码',
          '6. 完成注册'
        ]
      }
    };
  } catch (error) {
    console.error('注册GitHub失败:', error);
    return {
      code: 500,
      message: '注册失败: ' + error.message
    };
  }
};
