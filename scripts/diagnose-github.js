const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }).then(ctx => ctx.newPage());
  
  console.log('打开 GitHub 注册页面...');
  await page.goto('https://github.com/signup', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // 截图
  await page.screenshot({ path: 'github-signup.png', fullPage: false });
  console.log('已保存截图: github-signup.png');
  
  // 获取所有输入框
  const inputs = await page.$$eval('input', els => els.map(el => ({
    type: el.type,
    name: el.name,
    id: el.id,
    placeholder: el.placeholder,
    visible: el.offsetParent !== null,
    tag: el.outerHTML.substring(0, 200)
  })));
  
  console.log('\n找到的输入框:');
  inputs.forEach((inp, i) => {
    console.log(`\n[${i}] type=${inp.type}, name=${inp.name}, id=${inp.id}, placeholder=${inp.placeholder}`);
    console.log(`    visible=${inp.visible}`);
    console.log(`    ${inp.tag}`);
  });
  
  // 获取所有按钮
  const buttons = await page.$$eval('button', els => els.map(el => ({
    type: el.type,
    text: el.innerText.trim(),
    visible: el.offsetParent !== null
  })));
  
  console.log('\n找到的按钮:');
  buttons.forEach((btn, i) => {
    console.log(`[${i}] type=${btn.type}, text="${btn.text}", visible=${btn.visible}`);
  });
  
  // 保存 HTML
  const html = await page.content();
  require('fs').writeFileSync('github-page.html', html);
  console.log('\n已保存 HTML: github-page.html');
  
  await browser.close();
}

main().catch(console.error);
