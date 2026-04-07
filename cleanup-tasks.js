const cloudbase = require('@cloudbase/js-sdk');

async function cleanup() {
  console.log('===== 清理旧任务 =====\n');
  
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  const auth = app.auth();
  await auth.signInAnonymously();
  
  // 获取所有任务
  const result = await app.callFunction({
    name: 'github-register-task',
    data: { action: 'getPendingTask' }
  });
  
  if (result.result && result.result.data) {
    console.log('最新任务:', result.result.data._id);
    console.log('邮箱:', result.result.data.email);
  }
  
  console.log('\n请手动关闭之前的服务窗口，然后双击启动GitHub注册服务.bat');
}

cleanup();
