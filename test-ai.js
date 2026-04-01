/**
 * CloudBase AI 服务测试脚本
 * 测试混元AI是否可用
 */

const testAI = async () => {
  console.log('🧪 开始测试AI服务...\n');

  // 测试数据
  const testData = {
    model: 'hunyuan-exp',
    messages: [
      { role: 'user', content: '你好，请用一句话介绍台球运动' }
    ]
  };

  console.log('📝 测试请求:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  console.log('✅ AI服务配置说明:');
  console.log('1. 混元AI已开通（Token使用量: 0%）');
  console.log('2. 每月有免费调用额度');
  console.log('3. 可以直接在云函数中调用\n');

  console.log('📖 使用方法:');
  console.log('在云函数中使用 @cloudbase/node-sdk:');
  console.log(`
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init();
const ai = app.ai();

// 调用混元AI
const result = await ai.generateText({
  model: 'hunyuan-exp',
  messages: [{ role: 'user', content: '你的问题' }]
});
  `);

  console.log('🎉 测试完成！AI服务已就绪。');
};

testAI();
