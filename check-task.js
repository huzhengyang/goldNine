const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  await app.auth().signInAnonymously();
  
  const taskId = '71fe4ab869d0909c02df221347034b33';
  
  // 查询任务状态
  console.log('查询任务状态:', taskId);
  const result = await app.callFunction({
    name: 'github-register-task',
    data: { action: 'getStatus', taskId }
  });
  
  console.log('结果:', JSON.stringify(result.result, null, 2));
}

main().catch(err => {
  console.error('错误:', err.message);
});
