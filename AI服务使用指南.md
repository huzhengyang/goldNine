# GoldNine 项目 - AI 服务使用指南

**配置时间：** 2026-04-01  
**环境ID：** `bluetooth-website-3eyhlocfe7b405`

---

## ✅ AI 服务状态

### 已开通的AI模型

| 模型名称 | 状态 | Token使用量 | 说明 |
|---------|------|-----------|------|
| **混元 (hunyuan-exp)** | ✅ 已开通 | 0% | 腾讯混元大模型，用于文本生成 |
| **DeepSeek** | ✅ 已开通 | - | 开源大模型 |

---

## 🎯 AI 服务应用场景

### 1. 新闻资讯 - AI改写与摘要
**功能：** 抓取台球新闻 → AI改写/生成摘要 → 存入数据库

```javascript
// 云函数示例：news-ai-rewrite/index.js
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init();
const db = app.database();
const ai = app.ai();

exports.main = async (event, context) => {
  const { originalContent, title } = event;
  
  // 1. 生成AI摘要
  const summaryResult = await ai.generateText({
    model: 'hunyuan-exp',
    messages: [{
      role: 'user',
      content: `请为以下台球新闻生成一个50字以内的摘要：\n\n标题：${title}\n内容：${originalContent}`
    }]
  });
  
  // 2. AI改写标题
  const titleResult = await ai.generateText({
    model: 'hunyuan-exp',
    messages: [{
      role: 'user',
      content: `请改写以下台球新闻标题，使其更吸引人（不超过30字）：\n\n原标题：${title}`
    }]
  });
  
  return {
    summary: summaryResult.choices[0].message.content,
    newTitle: titleResult.choices[0].message.content
  };
};
```

---

### 2. AI动作分析 - 训练建议生成
**功能：** 视频帧分析 → AI生成训练建议 → 保存报告

```javascript
// 云函数示例：ai-video-analysis/index.js
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init();
const db = app.database();
const ai = app.ai();

exports.main = async (event, context) => {
  const { frames, userId } = event;
  
  // 1. 调用视觉AI识别动作（需要单独开通）
  // const visionResult = await app.ai.vision.detectPose(frames);
  
  // 2. AI生成训练建议
  const adviceResult = await ai.generateText({
    model: 'hunyuan-exp',
    messages: [{
      role: 'user',
      content: `根据台球动作分析结果，为用户提供训练建议：
      
      握杆评分：75分
      站位评分：80分
      发力评分：70分
      
      请提供：
      1. 整体评价
      2. 需要改进的点（3条）
      3. 训练建议
      `
    }]
  });
  
  // 3. 保存分析记录到数据库
  await db.collection('ai_analysis').add({
    userId,
    frames,
    overallScore: 75,
    advice: adviceResult.choices[0].message.content,
    createdAt: new Date()
  });
  
  return {
    success: true,
    advice: adviceResult.choices[0].message.content
  };
};
```

---

## 💰 免费额度说明

### 混元AI个人版免费额度
- **每月免费Token数：** 查看控制台显示
- **计费方式：** 按Token数量计费
- **适用场景：** 文本生成、摘要、改写

### AI视觉分析（需单独开通）
- **位置：** AI+ → 视觉服务
- **功能：** 人体关键点检测、姿态识别
- **费用：** 按调用次数计费（有免费额度）

---

## 🔧 AI服务配置步骤

### ✅ 混元AI（已开通）
1. 访问：https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/ai
2. 点击"查看赠送Token用量"查看免费额度
3. 直接在云函数中使用

### ⚠️ AI视觉分析（需手动开通）
**用于视频动作分析**

1. 访问：https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/ai
2. 找到"视觉服务"或"人体分析"
3. 点击"开通服务"
4. 确认免费额度

**开通后可用于：**
- 人体关键点检测
- 姿态识别
- 动作分析

---

## 📊 AI服务调用示例

### 方式1: 在云函数中调用（推荐）
```javascript
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init();
const ai = app.ai();

// 文本生成
const result = await ai.generateText({
  model: 'hunyuan-exp',
  messages: [
    { role: 'system', content: '你是一个台球教练助手' },
    { role: 'user', content: '如何提高击球准确度？' }
  ],
  temperature: 0.7,
  max_tokens: 500
});

console.log(result.choices[0].message.content);
```

### 方式2: 通过HTTP API调用
```javascript
// 前端直接调用（需要配置安全规则）
const response = await fetch('https://tcb-api.tencentcloudapi.com/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    model: 'hunyuan-exp',
    messages: [{ role: 'user', content: '你的问题' }]
  })
});
```

---

## 🎯 下一步：创建AI云函数

### 建议1: 新闻AI改写云函数
```bash
# 创建云函数目录
mkdir -p cloudfunctions/news-ai-rewrite

# 文件结构
cloudfunctions/news-ai-rewrite/
├── index.js      # 主函数
├── package.json  # 依赖配置
└── README.md     # 说明文档
```

### 建议2: AI动作分析云函数
```bash
# 创建云函数目录
mkdir -p cloudfunctions/ai-video-analysis

# 文件结构
cloudfunctions/ai-video-analysis/
├── index.js      # 主函数
├── package.json  # 依赖配置
└── README.md     # 说明文档
```

---

## ✅ 配置完成检查

- [x] 混元AI已开通（Token使用量: 0%）
- [ ] AI视觉分析开通（用于视频分析）
- [ ] 创建新闻AI改写云函数
- [ ] 创建AI动作分析云函数
- [ ] 测试AI调用

---

## 📖 参考文档

- [CloudBase AI SDK 文档](https://docs.cloudbase.net/ai/overview)
- [混元大模型文档](https://cloud.tencent.com/document/product/1729)
- [AI视觉分析文档](https://cloud.tencent.com/document/product/867)

---

## 💡 成本优化建议

### 1. 使用缓存
对于重复的新闻改写请求，可以使用缓存减少AI调用次数。

### 2. 批量处理
将多条新闻合并处理，减少API调用次数。

### 3. 异步处理
对于AI分析任务，使用异步队列处理，避免阻塞用户请求。

### 4. 监控用量
定期查看Token使用量，避免超额。

---

**AI服务已就绪！可以开始开发AI功能了！** 🚀
