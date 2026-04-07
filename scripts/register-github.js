/**
 * GitHub 自动注册脚本
 * 使用方法: node scripts/register-github.js <email> <password> <receiveCodeUrl>
 */

const { chromium } = require('playwright');
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
          // 尝试多种格式提取验证码
          // 格式1: 纯数字验证码
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

// 等待验证码（轮询接码页面）
async function waitForVerificationCode(receiveCodeUrl, maxWaitTime = 180000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const code = await fetchVerificationCode(receiveCodeUrl);
      if (code) {
        console.log('✓ 获取到验证码:', code);
        return code;
      }
    } catch (error) {
      console.error('获取验证码失败:', error.message);
    }
    
    console.log('等待验证码... (已等待', Math.floor((Date.now() - startTime) / 1000), '秒)');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 每5秒检查一次
  }
  
  throw new Error('等待验证码超时');
}

async function registerGitHub(email, password, receiveCodeUrl) {
  console.log('\n========================================');
  console.log('GitHub 自动注册脚本');
  console.log('========================================');
  console.log('邮箱:', email);
  console.log('密码:', password);
  console.log('接码地址:', receiveCodeUrl);
  console.log('========================================\n');
  
  // 生成用户名
  const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  console.log('生成的用户名:', username);
  
  const browser = await chromium.launch({ 
    headless: false, // 显示浏览器窗口
    slowMo: 100 // 减慢操作速度，便于观察
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. 打开GitHub注册页面
    console.log('\n[步骤1] 打开GitHub注册页面...');
    await page.goto('https://github.com/signup', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 2. 输入邮箱
    console.log('[步骤2] 输入邮箱...');
    const emailInput = await page.waitForSelector('input[name="user[email]"]', { timeout: 10000 });
    await emailInput.fill(email);
    await page.waitForTimeout(500);
    
    // 3. 点击继续或等待密码输入框出现
    console.log('[步骤3] 等待密码输入框出现...');
    try {
      const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
      if (continueButton) {
        await continueButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      // 可能自动跳转了，继续
    }
    
    // 4. 输入密码
    console.log('[步骤4] 输入密码...');
    const passwordInput = await page.waitForSelector('input[name="user[password]"]', { timeout: 10000 });
    await passwordInput.fill(password);
    await page.waitForTimeout(500);
    
    // 5. 点击继续
    console.log('[步骤5] 点击继续...');
    try {
      const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
      if (continueButton) {
        await continueButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      // 继续
    }
    
    // 6. 输入用户名
    console.log('[步骤6] 输入用户名...');
    const usernameInput = await page.waitForSelector('input[name="user[user_login]"]', { timeout: 10000 });
    await usernameInput.fill(username);
    await page.waitForTimeout(500);
    
    // 7. 点击继续
    console.log('[步骤7] 点击继续...');
    try {
      const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
      if (continueButton) {
        await continueButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      // 继续
    }
    
    // 8. 处理验证码/CAPTCHA
    console.log('[步骤8] 等待验证页面...');
    await page.waitForTimeout(3000);
    
    // 检查是否需要验证码
    const captchaInput = await page.$('input[name="user[verification_code]"]');
    if (captchaInput) {
      console.log('\n[步骤9] 需要邮箱验证码...');
      
      if (receiveCodeUrl) {
        console.log('正在从接码地址获取验证码...');
        const code = await waitForVerificationCode(receiveCodeUrl);
        
        if (code) {
          await captchaInput.fill(code);
          await page.waitForTimeout(500);
          
          // 点击验证按钮
          const verifyButton = await page.$('button[type="submit"], button:has-text("Verify")');
          if (verifyButton) {
            await verifyButton.click();
            await page.waitForTimeout(3000);
          }
        }
      } else {
        console.log('⚠ 没有接码地址，请手动输入验证码');
        console.log('等待60秒供手动操作...');
        await page.waitForTimeout(60000);
      }
    }
    
    // 9. 完成注册
    console.log('[步骤9] 检查注册状态...');
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    if (currentUrl.includes('github.com') && !currentUrl.includes('signup')) {
      console.log('\n✓ 注册成功！');
      console.log('用户名:', username);
      console.log('邮箱:', email);
      
      // 等待一会儿让用户看到结果
      await page.waitForTimeout(10000);
      
      return {
        success: true,
        username,
        email
      };
    } else {
      console.log('\n⚠ 注册可能未完成，当前页面:', currentUrl);
      console.log('请手动完成剩余步骤');
      console.log('浏览器将保持打开状态60秒...');
      await page.waitForTimeout(60000);
      
      return {
        success: false,
        message: '可能需要手动完成'
      };
    }
    
  } catch (error) {
    console.error('\n✗ 注册失败:', error.message);
    console.log('浏览器将保持打开状态供手动操作...');
    await page.waitForTimeout(120000);
    
    return {
      success: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('\n使用方法:');
    console.log('  node register-github.js <email> <password> [receiveCodeUrl]');
    console.log('\n示例:');
    console.log('  node register-github.js test@example.com mypassword123 https://2fa.show/2fa/xxx');
    process.exit(1);
  }
  
  const [email, password, receiveCodeUrl] = args;
  
  const result = await registerGitHub(email, password, receiveCodeUrl);
  
  if (result.success) {
    console.log('\n========================================');
    console.log('注册成功！');
    console.log('========================================');
    process.exit(0);
  } else {
    console.log('\n========================================');
    console.log('注册未完成');
    console.log('========================================');
    process.exit(1);
  }
}

main().catch(console.error);
