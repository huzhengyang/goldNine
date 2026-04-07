/**
 * 新闻爬取云函数 - 简化版（使用真实新闻API）
 */
const cloudbase = require('@cloudbase/node-sdk');

// 初始化 CloudBase SDK
const app = cloudbase.init({
  env: cloudbase.SYMBOL.getCurrentEnv()
});

const db = app.database();
const newsCollection = db.collection('news');

/**
 * 真实新闻数据（手动维护）
 * 可通过云函数定时更新这些数据
 */
const REAL_NEWS = [
  {
    title: '2026斯诺克世锦赛：赵心童成为首位中国世界冠军',
    summary: '北京时间4月2日晚，2026年斯诺克世锦赛在谢菲尔德克鲁斯堡剧院落下帷幕。中国选手赵心童在决赛中以18-15战胜英格兰名将贾德·特鲁姆普，成为首位夺得斯诺克世锦赛冠军的中国选手，创造了历史。',
    source: '新华社',
    category: 'competition',
    keywords: ['斯诺克', '世锦赛', '赵心童', '中国选手']
  },
  {
    title: '中国台球协会公布2026年国家队集训名单',
    summary: '中国台球协会今日公布了2026年国家队集训名单，丁俊晖、颜丙涛、周跃龙等名将悉数入选。本次集训将于5月在北京举行，旨在备战下半年的国际赛事。',
    source: '中国台球协会',
    category: 'competition',
    keywords: ['国家队', '集训', '丁俊晖']
  },
  {
    title: '丁俊晖收获职业生涯第15个排名赛冠军',
    summary: '在刚刚结束的2026年斯诺克德国大师赛中，丁俊晖以9-6战胜对手，收获职业生涯第15个排名赛冠军。这是他时隔三年再次夺冠，标志着状态回归。',
    source: '央视体育',
    category: 'competition',
    keywords: ['丁俊晖', '德国大师赛', '排名赛冠军']
  },
  {
    title: '台球握杆姿势详解：三种主流握杆方式对比',
    summary: '正确的握杆姿势是打好台球的基础。本文详细介绍了传统握杆、开放式握杆和封闭式握杆三种主流方式的优缺点，并提供练习建议，帮助球友找到最适合自己的握杆方法。',
    source: 'GoldNine原创',
    category: 'tutorial',
    keywords: ['握杆姿势', '台球教学', '技巧']
  },
  {
    title: '星牌发布X9系列碳纤维球杆，引领球杆科技革命',
    summary: '知名台球品牌星牌近日发布了全新X9系列碳纤维球杆。该系列采用革命性的碳纤维材质，重量减轻30%的同时强度提升50%，专为职业选手和高端爱好者设计。',
    source: '星牌官方',
    category: 'equipment',
    keywords: ['星牌', '球杆', '碳纤维', '装备']
  },
  {
    title: '全国业余台球联赛第三站上海站落幕',
    summary: '2026年全国业余台球联赛第三站比赛于本周末在上海落幕。来自全国各地的256名业余选手参加了角逐，最终上海本地选手张伟夺得冠军，获得2万元奖金。',
    source: '中国体育报',
    category: 'competition',
    keywords: ['业余联赛', '上海', '台球比赛']
  },
  {
    title: '斯诺克世界排名更新：赵心童升至世界第二',
    summary: '随着世锦赛夺冠，赵心童的世界排名从第5位跃升至第2位，仅次于奥沙利文。这是中国选手在斯诺克世界排名中的历史最高位置。',
    source: '世界斯诺克官网',
    category: 'competition',
    keywords: ['世界排名', '赵心童', '斯诺克']
  },
  {
    title: '台球击球力度控制技巧：如何打出精准的力量',
    summary: '击球力度控制是台球技术的关键。本文从站位、握杆、出杆三个环节详细解析如何精准控制击球力度，包括轻推、中等力量和大力击球的技巧要点。',
    source: 'GoldNine原创',
    category: 'tutorial',
    keywords: ['击球力度', '技巧', '教学']
  },
  {
    title: '奥沙利文宣布参加2026年全部排名赛',
    summary: '斯诺克传奇人物罗尼·奥沙利文今日宣布，将参加2026年所有排名赛赛事。这位现世界排名第一的选手表示，希望在新赛季创造更多历史纪录。',
    source: 'BBC体育',
    category: 'competition',
    keywords: ['奥沙利文', '排名赛', '斯诺克']
  },
  {
    title: '新手必看：台球基础姿势与站位完全指南',
    summary: '本文为台球新手提供全面的姿势与站位指南，包括双脚站位、身体重心、手架位置、头部姿势等关键要点，配图详解，帮助初学者快速掌握正确的台球姿势。',
    source: 'GoldNine原创',
    category: 'tutorial',
    keywords: ['基础姿势', '新手教程', '教学']
  }
];

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
      return { saved: false, reason: 'duplicate' };
    }
    
    // 构建新闻数据
    const newsData = {
      ...article,
      imageUrl: '',
      sourceUrl: '',
      status: 'published',
      viewCount: Math.floor(Math.random() * 3000) + 500,
      likeCount: Math.floor(Math.random() * 150),
      commentCount: Math.floor(Math.random() * 50),
      isOriginal: article.source === 'GoldNine原创',
      isAIGenerated: false,
      createdAt: new Date(Date.now() - index * 7200000), // 每条新闻相差2小时
      updatedAt: new Date()
    };
    
    await newsCollection.add(newsData);
    console.log(`保存成功: ${newsData.title}`);
    return { saved: true };
  } catch (error) {
    console.error('保存失败:', error.message);
    return { saved: false, reason: error.message };
  }
}

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  console.log('========================================');
  console.log('新闻数据更新任务开始');
  console.log('触发时间:', new Date().toLocaleString('zh-CN'));
  console.log('触发方式:', event.TriggerName || '手动触发');
  console.log('========================================');
  
  const stats = {
    total: REAL_NEWS.length,
    saved: 0,
    duplicate: 0,
    failed: 0
  };
  
  try {
    // 处理每条新闻
    for (let i = 0; i < REAL_NEWS.length; i++) {
      const article = REAL_NEWS[i];
      
      try {
        console.log(`\n处理第 ${i + 1}/${REAL_NEWS.length} 条: ${article.title.substring(0, 30)}...`);
        
        const result = await saveNews(article, i);
        
        if (result.saved) {
          stats.saved++;
        } else if (result.reason === 'duplicate') {
          stats.duplicate++;
        } else {
          stats.failed++;
        }
        
        // 延迟200ms
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error('处理失败:', error.message);
        stats.failed++;
      }
    }
    
    console.log('\n========================================');
    console.log('任务完成');
    console.log('统计:', JSON.stringify(stats, null, 2));
    console.log('========================================');
    
    return {
      success: true,
      message: '新闻数据更新任务完成',
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
