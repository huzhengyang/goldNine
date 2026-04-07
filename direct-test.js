const https = require('https');

const CLOUDBASE_ENV = 'goldnine-hk-8g3g5ijhec9df56e';

async function callCloudFunction(action, data = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ action, ...data });
    
    const options = {
      hostname: `${CLOUDBASE_ENV}.service.tcloudbase.com`,
      port: 443,
      path: `/cloudfunctions/github-register-task`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('发送请求到:', options.hostname + options.path);
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log('响应状态:', res.statusCode);
        try {
          resolve(JSON.parse(responseData));
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('请求错误:', e.message);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('===== 直接测试云函数调用 =====\n');
  
  try {
    console.log('测试 getPendingTask...');
    const result = await callCloudFunction('getPendingTask');
    console.log('\n结果:', JSON.stringify(result, null, 2));
    
    if (result.code === 0 && result.data) {
      console.log('\n✓ 发现任务!');
      console.log('任务ID:', result.data._id);
      console.log('邮箱:', result.data.email);
    } else {
      console.log('\n没有待处理任务');
    }
    
  } catch (error) {
    console.error('\n✗ 错误:', error.message);
  }
}

main();
