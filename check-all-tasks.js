const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  await app.auth().signInAnonymously();
  
  const db = app.database();
  const result = await db.collection('github_register_tasks')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();
  
  console.log('最近任务:');
  result.data.forEach(task => {
    console.log(`- ID: ${task._id}`);
    console.log(`  邮箱: ${task.email}`);
    console.log(`  用户名: ${task.username}`);
    console.log(`  状态: ${task.status}`);
    console.log(`  错误: ${task.error || '无'}`);
    console.log('');
  });
}

main().catch(console.error);
