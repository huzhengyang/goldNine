const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  await app.auth().signInAnonymously();
  
  const db = app.database();
  const result = await db.collection('github_register_tasks')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  
  console.log('任务数量:', result.data.length);
  result.data.forEach((task, i) => {
    console.log(`\n[${i+1}] ${task.email}`);
    console.log('  用户名:', task.username);
    console.log('  状态:', task.status);
    console.log('  结果:', JSON.stringify(task.result));
    console.log('  错误:', task.error || '无');
    console.log('  创建时间:', task.createdAt);
  });
}

main().catch(console.error);
