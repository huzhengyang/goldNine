const cloudbase = require('@cloudbase/js-sdk');

async function debug() {
  console.log('===== 调试检查 =====\n');
  
  try {
    const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
    const auth = app.auth();
    await auth.signInAnonymously();
    console.log('✓ 匿名登录成功');
    
    // 测试 getPendingTask
    console.log('\n1. 测试 getPendingTask...');
    const result = await app.callFunction({
      name: 'github-register-task',
      data: { action: 'getPendingTask' }
    });
    
    console.log('结果:', JSON.stringify(result.result, null, 2));
    
    // 如果有 pending 任务，手动更新为 pending 状态
    if (result.result && result.result.code === 0 && result.result.data) {
      console.log('\n发现任务:', result.result.data._id);
    } else {
      console.log('\n没有待处理任务，创建一个测试任务...');
      
      const addResult = await app.callFunction({
        name: 'github-register-task',
        data: {
          action: 'addTask',
          accountId: 'test-debug',
          email: 'debug@example.com',
          password: 'debug123',
          receiveCodeUrl: 'http://example.com'
        }
      });
      
      console.log('创建任务结果:', JSON.stringify(addResult.result, null, 2));
    }
    
  } catch (error) {
    console.error('\n✗ 错误:', error.message);
  }
}

debug();
