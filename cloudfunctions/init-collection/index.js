'use strict';

const cloudbase = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  try {
    const app = cloudbase.init({
      env: context.namespace
    });
    
    const db = app.database();
    const collectionName = 'github_register_tasks';
    
    // 尝试创建集合
    try {
      const result = await db.collection(collectionName).add({
        _id: 'init_record',
        type: 'init',
        createdAt: db.serverDate()
      });
      
      // 删除初始化记录
      await db.collection(collectionName).doc('init_record').remove();
      
      return {
        code: 0,
        message: `集合 ${collectionName} 创建成功`
      };
    } catch (error) {
      // 如果集合已存在
      if (error.message && error.message.includes('not exist')) {
        // 尝试再次添加
        await db.collection(collectionName).add({
          _id: 'init_record_2',
          type: 'init',
          createdAt: db.serverDate()
        });
        await db.collection(collectionName).doc('init_record_2').remove();
        
        return {
          code: 0,
          message: `集合 ${collectionName} 创建成功`
        };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('初始化失败:', error);
    return {
      code: 500,
      message: '初始化失败: ' + error.message,
      error: error.toString()
    };
  }
};
