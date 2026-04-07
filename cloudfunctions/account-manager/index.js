'use strict';

const cloudbase = require('@cloudbase/node-sdk');

async function ensureCollection(db, collectionName) {
  try {
    await db.collection(collectionName).limit(1).get();
  } catch (error) {
    if (error.message && error.message.includes('not exist')) {
      const result = await db.collection(collectionName).add({
        _id: 'init',
        type: 'init'
      });
      await db.collection(collectionName).doc('init').remove();
      console.log(`集合 ${collectionName} 创建成功`);
    }
  }
}

exports.main = async (event, context) => {
  const { action, accounts } = event;
  
  try {
    const app = cloudbase.init({ env: context.namespace });
    const db = app.database();
    const collectionName = 'kiro_accounts';
    
    await ensureCollection(db, collectionName);
    
    // 获取所有账户
    if (action === 'get') {
      const result = await db.collection(collectionName)
        .where({ _id: 'main_accounts' })
        .get();
      
      if (result.data && result.data.length > 0) {
        return { code: 0, data: result.data[0].accounts || [] };
      }
      return { code: 0, data: [] };
    }
    
    // 保存所有账户
    if (action === 'save') {
      // 删除旧记录
      try {
        await db.collection(collectionName).doc('main_accounts').remove();
      } catch (e) {}
      
      // 添加新记录
      await db.collection(collectionName).add({
        _id: 'main_accounts',
        accounts: accounts || [],
        updatedAt: db.serverDate()
      });
      
      return { code: 0, message: '保存成功' };
    }
    
    return { code: 400, message: '未知操作' };
    
  } catch (error) {
    console.error('账户操作失败:', error);
    return { code: 500, message: error.message };
  }
};
