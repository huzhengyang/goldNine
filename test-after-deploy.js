const cloudbase = require('@cloudbase/js-sdk');

async function test() {
  try {
    console.log('===== 测试 GitHub 注册功能 =====\n');
    
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
    
    // 测试创建任务
    console.log('\n1. 测试创建注册任务...');
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
    
    console.log('创建任务结果:', JSON.stringify(result.result, null, 2));
    
    if (result.result && result.result.code === 0) {
      const taskId = result.result.data.taskId;
      console.log('\n✓ 任务创建成功！任务ID:', taskId);
      
      // 测试查询状态
      console.log('\n2. 测试查询任务状态...');
      const statusResult = await app.callFunction({
        name: 'github-register-task',
        data: {
          action: 'getStatus',
          taskId: taskId
        }
      });
      
      console.log('查询状态结果:', JSON.stringify(statusResult.result, null, 2));
      
      console.log('\n✓ 所有测试通过！');
      console.log('\n现在可以在前端页面测试 GitHub 注册功能了。');
      
    } else {
      console.log('\n✗ 任务创建失败:', result.result?.message);
    }
    
  } catch (error) {
    console.error('\n✗ 测试失败:', error.message);
    console.error(error);
  }
}

test();
