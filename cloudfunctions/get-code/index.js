// 云函数：获取验证码 (HTTP类型)
const https = require('https');
const http = require('http');

exports.main = async (event, context) => {
  // 处理CORS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  // 解析请求体
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    body = {};
  }

  const { url } = body;
  
  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 400,
        message: '缺少接码URL'
      })
    };
  }
  
  try {
    // 获取网页内容
    const html = await fetchPage(url);
    
    // 解析验证码和倒计时
    const result = parseVerificationCode(html);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 0,
        data: result
      })
    };
  } catch (error) {
    console.error('获取验证码失败:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 500,
        message: '获取验证码失败',
        error: error.message
      })
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
  
  // 提取倒计时（剩余有效时间）
  const countdownMatch = html.match(/剩余有效时间[^\d]*(\d+)/);
  const countdown = countdownMatch ? parseInt(countdownMatch[1]) : 30;
  
  return {
    code: code,
    countdown: countdown,
    timestamp: Date.now()
  };
}
