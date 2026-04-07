/**
 * GitHub 自动注册本地服务
 * 运行方法: node scripts/local-server.js
 * 服务地址: http://localhost:3456
 */

const express = require('express');
const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3456;

// 从接码URL获取验证码
async function fetchVerificationCode(receiveCodeUrl) {
  return new Promise((resolve, reject) => {
    const client = receiveCodeUrl.startsWith('https') ? https : http;
    
    client.get(receiveCodeUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
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

// 等待验证码
async function waitForVerificationCode(receiveCodeUrl, maxWaitTime = 180000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const code = await fetchVerificationCode(receiveCodeUrl);
      if (code) {
        return code;
      }
    } catch (error) {
      console.error('获取验证码失败:', error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error('等待验证码超时');
}

// GitHub注册API
app.post('/api/register-github', async (req, res) => {
  const { email, password, receiveCodeUrl } = req.body;
  
  console.log('\n========================================');
  console.log('GitHub 注册请求');
  console.log('========================================');
  console.log('邮箱:', email);
  console.log('密码:', password);
  console.log('接码地址:', receiveCodeUrl);
  console.log('========================================\n');
  
  if (!email || !password) {
    return res.json({
      success: false,
      message: '缺少邮箱或密码'
    });
  }
  
  const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  try {
    const browser = await chromium.launch({ 
      headless: false,
      slowMo: 100
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // 打开注册页面
      console.log('[步骤1] 打开GitHub注册页面...');
      await page.goto('https://github.com/signup', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      // 输入邮箱
      console.log('[步骤2] 输入邮箱...');
      const emailInput = await page.waitForSelector('input[name="user[email]"]', { timeout: 10000 });
      await emailInput.fill(email);
      await page.waitForTimeout(500);
      
      // 等待并输入密码
      console.log('[步骤3] 输入密码...');
      try {
        const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
        if (continueButton) {
          await continueButton.click();
          await page.waitForTimeout(2000);
        }
      } catch (error) {}
      
      const passwordInput = await page.waitForSelector('input[name="user[password]"]', { timeout: 10000 });
      await passwordInput.fill(password);
      await page.waitForTimeout(500);
      
      // 输入用户名
      console.log('[步骤4] 输入用户名...');
      try {
        const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
        if (continueButton) {
          await continueButton.click();
          await page.waitForTimeout(2000);
        }
      } catch (error) {}
      
      const usernameInput = await page.waitForSelector('input[name="user[user_login]"]', { timeout: 10000 });
      await usernameInput.fill(username);
      await page.waitForTimeout(500);
      
      // 提交
      console.log('[步骤5] 提交注册...');
      try {
        const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
        if (continueButton) {
          await continueButton.click();
          await page.waitForTimeout(3000);
        }
      } catch (error) {}
      
      // 处理验证码
      const captchaInput = await page.$('input[name="user[verification_code]"]');
      if (captchaInput && receiveCodeUrl) {
        console.log('[步骤6] 获取并输入验证码...');
        const code = await waitForVerificationCode(receiveCodeUrl, 60000);
        
        if (code) {
          await captchaInput.fill(code);
          await page.waitForTimeout(500);
          
          const verifyButton = await page.$('button[type="submit"], button:has-text("Verify")');
          if (verifyButton) {
            await verifyButton.click();
            await page.waitForTimeout(5000);
          }
        }
      }
      
      // 检查结果
      const currentUrl = page.url();
      await page.waitForTimeout(3000);
      
      await browser.close();
      
      if (!currentUrl.includes('signup')) {
        console.log('\n✓ 注册成功！\n');
        return res.json({
          success: true,
          username,
          email,
          message: '注册成功'
        });
      } else {
        console.log('\n⚠ 可能需要手动完成\n');
        return res.json({
          success: false,
          message: '可能需要手动完成验证',
          username
        });
      }
      
    } catch (error) {
      await browser.close();
      throw error;
    }
    
  } catch (error) {
    console.error('\n✗ 注册失败:', error.message);
    return res.json({
      success: false,
      message: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GitHub注册服务' });
});

// 启动服务
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('GitHub 自动注册本地服务已启动');
  console.log('========================================');
  console.log('服务地址: http://localhost:' + PORT);
  console.log('API端点:');
  console.log('  POST http://localhost:' + PORT + '/api/register-github');
  console.log('  GET  http://localhost:' + PORT + '/api/health');
  console.log('========================================');
  console.log('\n请在前端页面点击"注册GitHub"按钮\n');
});
