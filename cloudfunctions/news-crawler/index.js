// 新闻抓取云函数 - 简化版（使用示例数据）
const cloudbase = require('@cloudbase/node-sdk');

// 初始化 CloudBase SDK
const app = cloudbase.init({
  env: cloudbase.SYMBOL.getCurrentEnv()
});

const db = app.database();
const newsCollection = db.collection('news');

// 示例新闻数据
const SAMPLE_NEWS = [
  {
    title: '赵心童2026世锦赛夺冠创历史，中国选手首次登顶',
    summary: '北京时间4月2日，2026斯诺克世锦赛在谢菲尔德落下帷幕。中国选手赵心童在决赛中以13-11战胜对手，成为首位夺得世锦赛冠军的中国选手，创造历史。',
    category: 'competition',
    keywords: ['斯诺克', '世锦赛', '赵心童', '中国选手']
  },
  {
    title: '台球握杆技巧详解：如何找到最适合你的握杆方式',
    summary: '正确的握杆姿势是打好台球的基础。本文详细介绍了三种主流握杆方式：传统握杆、开放式握杆和封闭式握杆的优缺点，帮助你找到最适合自己的握杆方法。',
    category: 'tutorial',
    keywords: ['握杆技巧', '台球教学', '姿势纠正']
  },
  {
    title: '星牌推出全新X9系列球杆，搭载碳纤维科技',
    summary: '知名台球品牌星牌近日发布了全新X9系列球杆，采用革命性的碳纤维材质，重量更轻、强度更高。该系列球杆专为专业选手设计，预计将在下月上市。',
    category: 'equipment',
    keywords: ['星牌', '球杆', '碳纤维', '台球装备']
  },
  {
    title: '全国业余台球联赛第三站将在上海举行',
    summary: '2026年全国业余台球联赛第三站比赛将于本周末在上海开杆。本次比赛吸引了来自全国各地的256名业余选手参加，总奖金达到10万元。',
    category: 'competition',
    keywords: ['业余联赛', '台球比赛', '上海']
  }
];

/**
 * 使用 AI 改写新闻
 */
async function rewriteWithAI(article) {
  try {
    const ai = app.ai();
    
    const prompt = `请对以下台球新闻标题和摘要进行优化改写，使其更具吸引力：
标题：${article.title}
摘要：${article.summary}

请返回JSON格式：{"title":"优化后的标题","summary":"改写后的摘要（150-250字）"}`;

    const result = await ai.generateText({
      model: 'hunyuan-2.0-instruct-20251111',
      prompt,
      temperature: 0.7,
      maxTokens: 300
    });
    
    console.log('AI改写结果:', result.text);
    
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiContent = JSON.parse(jsonMatch[0]);
      return {
        ...article,
        title: aiContent.title || article.title,
        summary: aiContent.summary || article.summary
      };
    }
    
    return article;
  } catch (error) {
    console.error('AI改写失败:', error.message);
    return article;
  }
}

/**
 * 保存新闻到数据库
 */
async function saveNews(article, index) {
  try {
    // 检查是否已存在
    const existing = await newsCollection
      .where({
        title: article.title
      })
      .limit(1)
      .get();
    
    if (existing.data && existing.data.length > 0) {
      console.log(`新闻已存在: ${article.title}`);
      return false;
    }
    
    // 构建新闻数据
    const newsData = {
      ...article,
      imageUrl: '',
      source: 'GoldNine示例',
      sourceUrl: '',
      status: 'published',
      viewCount: Math.floor(Math.random() * 2000) + 500,
      likeCount: Math.floor(Math.random() * 100),
      commentCount: 0,
      isOriginal: true,
      isAIGenerated: true,
      createdAt: new Date(Date.now() - index * 3600000), // 每条新闻相差1小时
      updatedAt: new Date()
    };
    
    await newsCollection.add(newsData);
    console.log(`保存成功: ${newsData.title}`);
    return true;
  } catch (error) {
    console.error('保存失败:', error.message);
    return false;
  }
}

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  console.log('========================================');
  console.log('新闻抓取任务开始');
  console.log('触发时间:', new Date().toLocaleString('zh-CN'));
  console.log('事件:', JSON.stringify(event));
  console.log('========================================');
  
  const stats = {
    total: SAMPLE_NEWS.length,
    saved: 0,
    duplicate: 0,
    failed: 0
  };
  
  try {
    // 处理每条新闻
    for (let i = 0; i < SAMPLE_NEWS.length; i++) {
      const article = SAMPLE_NEWS[i];
      
      try {
        console.log(`\n处理第 ${i + 1}/${SAMPLE_NEWS.length} 条新闻: ${article.title}`);
        
        // AI改写
        console.log('开始AI改写...');
        const rewritten = await rewriteWithAI(article);
        
        // 保存到数据库
        console.log('保存到数据库...');
        const saved = await saveNews(rewritten, i);
        
        if (saved) {
          stats.saved++;
        } else {
          stats.duplicate++;
        }
        
        // 延迟500ms
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('处理失败:', error.message);
        stats.failed++;
      }
    }
    
    console.log('\n========================================');
    console.log('任务完成');
    console.log('统计:', JSON.stringify(stats));
    console.log('========================================');
    
    return {
      success: true,
      message: '新闻抓取任务完成',
      stats,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('任务失败:', error);
    return {
      success: false,
      message: error.message,
      stats
    };
  }
};
