'use strict';

const cloudbase = require('@cloudbase/node-sdk');

async function initCollection() {
  try {
    // 初始化 CloudBase
    const app = cloudbase.init({
      env: 'goldnine-hk-8g3g5ijhec9df56e'
    });
    
    const db = app.database();
    const collectionName = 'github_register_tasks';
    
    console.log(`检查集合 ${collectionName} 是否存在...`);
    
    // 尝试查询集合，如果不存在会报错
    try {
      await db.collection(collectionName).limit(1).get();
      console.log(`✓ 集合 ${collectionName} 已存在`);
      return;
    } catch (error) {
      if (error.message && error.message.includes('not exist')) {
        console.log(`集合 ${collectionName} 不存在，尝试创建...`);
        
        // 通过添加一条记录来创建集合
        const result = await db.collection(collectionName).add({
          _id: 'init_record',
          type: 'init',
          message: 'This is an initialization record',
          createdAt: db.serverDate()
        });
        
        console.log(`✓ 集合 ${collectionName} 创建成功！`);
        
        // 删除初始化记录
        await db.collection(collectionName).doc('init_record').remove();
        console.log(`✓ 初始化记录已清理`);
        
      } else {
        throw error;
      }
    }
    
    console.log('\n初始化完成！');
    
  } catch (error) {
    console.error('✗ 初始化失败:', error.message);
    console.error('完整错误:', error);
    process.exit(1);
  }
}

initCollection();
