const cloudbase = require('@cloudbase/js-sdk');

async function test() {
  try {
    // 初始化 CloudBase
    const app = cloudbase.init({
      env: 'goldnine-hk-8g3g5ijhec9df56e'
    });
    
    // 匿名登录
    const auth = app.auth();
    const loginState = await auth.getLoginState();
    if (!loginState) {
      await auth.signInAnonymously();
      console.log('✓ 匿名登录成功');
    }
    
    // 测试调用云函数
    console.log('\n测试调用 github-register-task 云函数...');
    const result = await app.callFunction({
      name: 'github-register-task',
      data: {
        action: 'addTask',
        accountId: 'test-001',
        email: 'test@example.com',
        password: 'test123',
        receiveCodeUrl: 'http://test.com'
      }
    });
    
    console.log('\n调用结果:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.result && result.result.code === 0) {
      console.log('\n✓ 测试成功！任务ID:', result.result.data.taskId);
    } else {
      console.log('\n✗ 测试失败:', result.result?.message || '未知错误');
    }
    
  } catch (error) {
    console.error('\n✗ 错误:', error.message);
    console.error('完整错误:', error);
  }
}

test();
