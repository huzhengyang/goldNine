// 云函数：获取验证码 (Event类型)
const https = require('https');
const http = require('http');

exports.main = async (event, context) => {
  const { url } = event;
  
  if (!url) {
    return {
      code: 400,
      message: '缺少接码URL'
    };
  }
  
  try {
    // 获取网页内容
    const html = await fetchPage(url);
    
    // 解析验证码和倒计时
    const result = parseVerificationCode(html);
    
    return {
      code: 0,
      data: result
    };
  } catch (error) {
    console.error('获取验证码失败:', error);
    return {
      code: 500,
      message: '获取验证码失败',
      error: error.message
    };
  }
};

// 获取网页内容
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 解析验证码和倒计时
function parseVerificationCode(html) {
  // 提取验证码（6位数字）
  const codeMatch = html.match(/>(\d{6})<\//);
  const code = codeMatch ? codeMatch[1] : null;
  
  // 计算倒计时：验证码每30秒更新一次
  const now = Math.floor(Date.now() / 1000);
  const countdown = 30 - (now % 30);
  
  return {
    code: code,
    countdown: countdown,
    timestamp: Date.now()
  };
}
