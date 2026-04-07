const cloudbase = require('@cloudbase/js-sdk');
const { execSync } = require('child_process');

async function initDatabase() {
  console.log('===== 自动初始化数据库 =====\n');
  
  try {
    // 1. 部署云函数
    console.log('1. 部署 init-collection 云函数...');
    try {
      execSync('tcb fn deploy init-collection --env-id goldnine-hk-8g3g5ijhec9df56e --force', {
        cwd: process.cwd(),
        stdio: 'inherit',
        input: 'y\n'
      });
      console.log('✓ 云函数部署成功\n');
    } catch (deployError) {
      console.log('部署可能需要手动确认，继续尝试调用...\n');
    }
    
    // 等待几秒让云函数生效
    console.log('2. 等待云函数生效...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. 调用云函数创建集合
    console.log('3. 调用云函数创建集合...');
    const app = cloudbase.init({
      env: 'goldnine-hk-8g3g5ijhec9df56e'
    });
    
    const auth = app.auth();
    const loginState = await auth.getLoginState();
    if (!loginState) {
      await auth.signInAnonymously();
      console.log('✓ 匿名登录成功');
    }
    
    const result = await app.callFunction({
      name: 'init-collection'
    });
    
    console.log('\n调用结果:');
    console.log(JSON.stringify(result.result, null, 2));
    
    if (result.result && result.result.code === 0) {
      console.log('\n✓ 数据库初始化成功！');
      console.log('\n现在可以在页面测试 GitHub 注册功能了。');
    } else {
      console.log('\n✗ 初始化失败:', result.result?.message);
    }
    
  } catch (error) {
    console.error('\n✗ 错误:', error.message);
    console.error('\n请手动在控制台创建集合:');
    console.error('https://console.cloud.tencent.com/tcb/database/collection?envId=goldnine-hk-8g3g5ijhec9df56e');
  }
}

initDatabase();
