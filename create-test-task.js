const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  await app.auth().signInAnonymously();
  
  const result = await app.callFunction({
    name: 'github-register-task',
    data: {
      action: 'addTask',
      accountId: 'test-account-1',
      email: 'MurozukaTatsubuchi@gmail.com',
      password: 'TestPass123!',
      receiveCodeUrl: 'http://127.0.0.1:3000/api/receive'
    }
  });
  
  console.log('创建任务结果:', JSON.stringify(result.result, null, 2));
}

main().catch(console.error);
