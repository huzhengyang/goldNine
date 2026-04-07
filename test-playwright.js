const { chromium } = require('playwright');

async function test() {
  console.log('测试 Playwright...');
  
  try {
    const browser = await chromium.launch({ 
      headless: false,
      slowMo: 100
    });
    
    console.log('✓ 浏览器启动成功！');
    
    const page = await browser.newPage();
    await page.goto('https://github.com');
    
    console.log('✓ 页面加载成功！');
    console.log('标题:', await page.title());
    
    await browser.close();
    console.log('✓ 测试完成！');
    
  } catch (error) {
    console.error('✗ 错误:', error.message);
    console.error(error);
  }
}

test();
