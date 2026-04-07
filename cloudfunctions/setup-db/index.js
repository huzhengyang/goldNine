'use strict';

const cloudbase = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const app = cloudbase.init({
    env: context.namespace
  });
  
  const db = app.database();
  const collections = ['github_register_tasks', 'share_tokens'];
  const results = [];
  
  for (const collectionName of collections) {
    try {
      // 检查集合是否存在
      await db.collection(collectionName).limit(1).get();
      results.push({ name: collectionName, status: '已存在' });
    } catch (error) {
      if (error.message && error.message.includes('not exist')) {
        try {
          // 创建集合
          await db.collection(collectionName).add({
            _id: 'init_record',
            type: 'init',
            createdAt: db.serverDate()
          });
          await db.collection(collectionName).doc('init_record').remove();
          results.push({ name: collectionName, status: '创建成功' });
        } catch (createError) {
          results.push({ name: collectionName, status: '创建失败', error: createError.message });
        }
      } else {
        results.push({ name: collectionName, status: '检查失败', error: error.message });
      }
    }
  }
  
  return {
    code: 0,
    message: '数据库初始化完成',
    data: results
  };
};
