/**
 * GitHub 自动注册本地服务 (诊断修复版)
 * 基于实际页面结构重写
 */

const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const cloudbase = require('@cloudbase/js-sdk');

// CloudBase 配置
const CLOUDBASE_ENV = 'goldnine-hk-8g3g5ijhec9df56e';
const app = cloudbase.init({ env: CLOUDBASE_ENV });

// 从接码URL获取验证码
async function fetchVerificationCode(receiveCodeUrl) {
  return new Promise((resolve, reject) => {
    const client = receiveCodeUrl.startsWith('https') ? https : http;
    client.get(receiveCodeUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const codeMatch = data.match(/(\d{4,6})/);
        resolve(codeMatch ? codeMatch[1] : null);
      });
    }).on('error', reject);
  });
}

// 等待验证码
async function waitForVerificationCode(receiveCodeUrl, maxWaitTime = 120000) {
  const startTime = Date.now();
  console.log('  [接码] 开始等待验证码...');
  
  while (Date.now() - startTime < maxWaitTime) {
    const code = await fetchVerificationCode(receiveCodeUrl);
    if (code) {
      console.log('  [接码] ✓ 获取到验证码:', code);
      return code;
    }
    const waited = Math.floor((Date.now() - startTime) / 1000);
    console.log('  [接码] 等待中... (' + waited + '秒)');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  throw new Error('等待验证码超时');
}

// GitHub注册 (诊断修复版)
async function registerGitHub(email, password, username, receiveCodeUrl) {
  console.log('\n========================================');
  console.log('开始 GitHub 注册流程 (v3 诊断修复版)');
  console.log('  邮箱:', email);
  console.log('  用户名:', username);
  console.log('========================================');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    // 1. 打开注册页面
    console.log('  [1] 打开 GitHub 注册页面...');
    await page.goto('https://github.com/signup', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // 2. 输入邮箱 - 使用精确的 id 选择器
    console.log('  [2] 输入邮箱...');
    await page.locator('#email').fill(email, { timeout: 10000 });
    await page.waitForTimeout(500);
    
    // 3. 点击 "Create account" 按钮
    console.log('  [3] 点击 "Create account"...');
    await page.locator('button:has-text("Create account")').first().click();
    await page.waitForTimeout(3000);
    
    // 检查页面是否跳转到下一步
    const currentUrl = page.url();
    console.log('  [3.5] 当前URL:', currentUrl);
    
    // 4. 输入密码 - 页面可能需要验证邮箱
    console.log('  [4] 检查是否需要邮箱验证...');
    const bodyText = await page.$eval('body', el => el.innerText);
    
    if (bodyText.includes('verify') || bodyText.includes('verification')) {
      console.log('  [4.1] 检测到邮箱验证请求，等待验证码...');
      const code = await waitForVerificationCode(receiveCodeUrl, 120000);
      
      // 填写验证码
      const codeInput = await page.locator('input[name="verification_code"], input[id^="verification"]').first();
      if (await codeInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await codeInput.fill(code);
        await page.waitForTimeout(500);
        await page.locator('button:has-text("Verify")').first().click();
        await page.waitForTimeout(2000);
      }
    }
    
    // 5. 输入密码
    console.log('  [5] 输入密码...');
    const passwordVisible = await page.locator('#password').isVisible({ timeout: 5000 }).catch(() => false);
    if (passwordVisible) {
      await page.locator('#password').fill(password);
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Create account")').first().click();
      await page.waitForTimeout(3000);
    } else {
      console.log('  [5] 密码输入框不可见，跳过');
    }
    
    // 6. 输入用户名
    console.log('  [6] 输入用户名...');
    const loginVisible = await page.locator('#login').isVisible({ timeout: 5000 }).catch(() => false);
    if (loginVisible) {
      await page.locator('#login').fill(username);
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Create account")').first().click();
      await page.waitForTimeout(3000);
    } else {
      console.log('  [6] 用户名输入框不可见，跳过');
    }
    
    // 7. 最终检查
    const finalUrl = page.url();
    console.log('\n========================================');
    console.log('  最终URL:', finalUrl);
    console.log('========================================');
    
    await page.screenshot({ path: `github-final-${Date.now()}.png` });
    
    await browser.close();
    
    if (!finalUrl.includes('signup')) {
      console.log('  ✓ 注册成功！');
      return { success: true, username };
    } else {
      return { success: false, message: '可能需要手动完成验证' };
    }
    
  } catch (error) {
    console.error('  ✗ 注册失败:', error.message);
    try {
      await page.screenshot({ path: `github-error-${Date.now()}.png` });
    } catch (e) {}
    await browser.close();
    throw error;
  }
}

// 调用云函数
async function callCloudFunction(action, data = {}) {
  const auth = app.auth();
  if (!await auth.getLoginState()) {
    await auth.signInAnonymously();
  }
  const result = await app.callFunction({
    name: 'github-register-task',
    data: { action, ...data }
  });
  return result.result;
}

// 主循环
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   GitHub 自动注册服务 (v3 修复版)     ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  await app.auth().signInAnonymously();
  console.log('[初始化] ✓ 已连接 CloudBase\n');
  
  while (true) {
    try {
      console.log('[轮询] 检查待处理任务...');
      const result = await callCloudFunction('getPendingTask');
      
      if (result.code === 0 && result.data) {
        const task = result.data;
        console.log(`\n┌─────────────────────────────────────┐`);
        console.log(`│ 发现任务: ${task.email}`);
        console.log(`│ 用户名: ${task.username}`);
        console.log(`└─────────────────────────────────────┘`);
        
        try {
          const registerResult = await registerGitHub(
            task.email, task.password, task.username, task.receiveCodeUrl
          );
          
          await callCloudFunction('updateResult', {
            taskId: task._id,
            success: registerResult.success,
            githubUsername: registerResult.username,
            message: registerResult.message || '完成',
            error: registerResult.error || ''
          });
          
          console.log('\n✓ 任务完成！\n');
        } catch (error) {
          console.error('\n✗ 任务失败:', error.message);
          await callCloudFunction('updateResult', {
            taskId: task._id,
            success: false,
            error: error.message
          });
        }
      } else {
        console.log('[轮询] 无待处理任务，等待 5 秒...');
      }
    } catch (error) {
      console.error('[错误]', error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main().catch(console.error);
