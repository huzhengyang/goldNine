'use strict';

const cloudbase = require('@cloudbase/node-sdk');

// 确保集合存在
async function ensureCollection(db, collectionName) {
  try {
    await db.collection(collectionName).limit(1).get();
  } catch (error) {
    if (error.message && error.message.includes('not exist')) {
      const result = await db.collection(collectionName).add({
        _id: 'init_record',
        type: 'init',
        message: 'This is an initialization record',
        createdAt: db.serverDate()
      });
      
      await db.collection(collectionName).doc('init_record').remove();
      console.log(`集合 ${collectionName} 创建成功`);
    } else {
      throw error;
    }
  }
}

exports.main = async (event, context) => {
  const { action, accountId, email, password, receiveCodeUrl, taskId, success, githubUsername, message, error } = event;
  
  try {
    const app = cloudbase.init({
      env: context.namespace
    });
    const db = app.database();
    const collectionName = 'github_register_tasks';
    
    // 确保集合存在
    await ensureCollection(db, collectionName);
    
    // 添加任务
    if (action === 'addTask') {
      if (!email || !password) {
        return { code: 400, message: '缺少邮箱或密码' };
      }
      
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const result = await db.collection(collectionName).add({
        accountId: accountId || '',
        email,
        password,
        username,
        receiveCodeUrl: receiveCodeUrl || '',
        status: 'pending',
        result: null,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      });
      
      return {
        code: 0,
        message: '任务已创建',
        data: {
          taskId: result.id,
          status: 'pending',
          username,
          message: '请启动本地服务处理注册任务'
        }
      };
    }
    
    // 获取待处理任务
    if (action === 'getPendingTask') {
      const result = await db.collection(collectionName)
        .where({ status: 'pending' })
        .orderBy('createdAt', 'asc')
        .limit(1)
        .get();
      
      if (result.data && result.data.length > 0) {
        const task = result.data[0];
        
        // 标记为处理中
        await db.collection(collectionName)
          .doc(task._id)
          .update({
            status: 'processing',
            updatedAt: db.serverDate()
          });
        
        // 返回完整的任务数据
        return {
          code: 0,
          data: {
            _id: task._id,
            accountId: task.accountId,
            email: task.email,
            password: task.password,
            username: task.username,
            receiveCodeUrl: task.receiveCodeUrl,
            status: 'processing'
          }
        };
      }
      
      return {
        code: 0,
        data: null,
        message: '没有待处理任务'
      };
    }
    
    // 更新任务结果
    if (action === 'updateResult') {
      console.log('更新任务:', taskId, success);
      
      try {
        await db.collection(collectionName)
          .doc(taskId)
          .update({
            status: success ? 'completed' : 'failed',
            result: {
              success,
              githubUsername,
              message,
              error
            },
            updatedAt: db.serverDate()
          });
        
        console.log('任务更新成功');
        return { code: 0, message: '任务已更新', taskId, success };
      } catch (updateError) {
        console.error('更新失败:', updateError);
        return { code: 500, message: '更新失败: ' + updateError.message };
      }
    }
    
    // 查询任务状态
    if (action === 'getStatus') {
      console.log('查询任务状态:', taskId);
      
      try {
        const result = await db.collection(collectionName)
          .doc(taskId)
          .get();
        
        console.log('查询结果:', JSON.stringify(result));
        
        if (!result.data || Object.keys(result.data).length === 0) {
          return { code: 404, message: '任务不存在' };
        }
        
        return {
          code: 0,
          data: {
            taskId: result.data._id,
            status: result.data.status,
            result: result.data.result,
            username: result.data.username,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          }
        };
      } catch (queryError) {
        console.error('查询失败:', queryError);
        return { code: 500, message: '查询失败: ' + queryError.message };
      }
    }
    
    // 获取所有任务（调试用）
    if (action === 'getAllTasks') {
      const result = await db.collection(collectionName)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      return {
        code: 0,
        data: result.data
      };
    }
    
    return { code: 400, message: '未知操作' };
    
  } catch (error) {
    console.error('GitHub注册任务失败:', error);
    return {
      code: 500,
      message: '操作失败: ' + error.message,
      error: error.toString()
    };
  }
};
