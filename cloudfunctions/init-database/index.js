'use strict';

const cloudbase = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const { collectionName } = event;
  
  try {
    const app = cloudbase.init({
      env: context.namespace
    });
    
    const db = app.database();
    
    // 检查集合是否存在
    try {
      await db.collection(collectionName).limit(1).get();
      return {
        code: 0,
        message: `集合 ${collectionName} 已存在`
      };
    } catch (error) {
      if (error.message && error.message.includes('not exist')) {
        // 集合不存在，创建集合
        const result = await db.collection(collectionName).add({
          _id: 'init_record',
          type: 'init',
          message: 'This is an initialization record',
          createdAt: db.serverDate()
        });
        
        // 删除初始化记录
        await db.collection(collectionName).doc('init_record').remove();
        
        return {
          code: 0,
          message: `集合 ${collectionName} 创建成功`
        };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('初始化数据库失败:', error);
    return {
      code: 500,
      message: '初始化失败: ' + error.message,
      error: error.toString()
    };
  }
};
