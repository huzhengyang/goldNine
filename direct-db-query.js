const cloudbase = require('@cloudbase/js-sdk');

async function main() {
  const app = cloudbase.init({ env: 'goldnine-hk-8g3g5ijhec9df56e' });
  const auth = await app.auth().signInAnonymously();
  console.log('登录成功:', auth);
  
  const db = app.database();
  
  // 查询所有
  console.log('\n查询所有任务...');
  const result = await db.collection('github_register_tasks').get();
  console.log('结果:', JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error('错误:', err);
});
