const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  
  // 匿名登录
  await app.auth().signInAnonymously();
  console.log('✓ 已登录');
  
  // 查询 pending 任务
  const result = await app.callFunction({
    name: 'github-register-task',
    data: { action: 'getPendingTask' }
  });
  
  console.log('云函数返回:');
  console.log(JSON.stringify(result.result, null, 2));
  
  // 直接查询数据库
  const db = app.database();
  const tasks = await db.collection('github_register_tasks').get();
  console.log('\n数据库任务数:', tasks.data.length);
  tasks.data.forEach(t => {
    console.log(`- ${t.email}: ${t.status}`);
  });
}

main().catch(console.error);
