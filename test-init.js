const cloudbase = require('@cloudbase/js-sdk');

async function test() {
  console.log('===== 测试初始化数据库 =====\n');
  
  try {
    const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
    const auth = app.auth();
    await auth.signInAnonymously();
    console.log('✓ 匿名登录成功');
    
    const result = await app.callFunction({ name: 'init-collection' });
    console.log('\n结果:', JSON.stringify(result.result, null, 2));
    
    if (result.result && result.result.code === 0) {
      console.log('\n✓ 数据库集合创建成功！');
    } else {
      console.log('\n✗ 创建失败:', result.result?.message);
    }
    
  } catch (error) {
    console.error('\n✗ 错误:', error.message);
  }
}

test();
