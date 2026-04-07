const cloudbase = require('@cloudbase/js-sdk');

async function checkTasks() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  const auth = app.auth();
  await auth.signInAnonymously();
  
  const result = await app.callFunction({
    name: 'github-register-task',
    data: { action: 'getPendingTask' }
  });
  
  console.log('待处理任务结果:', JSON.stringify(result.result, null, 2));
}

checkTasks();
