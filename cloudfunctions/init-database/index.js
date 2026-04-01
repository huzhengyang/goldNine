// CloudBase 云函数：初始化数据库集合和索引
const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: cloudbase.getCurrentEnv(),
});

const db = app.database();

exports.main = async (event, context) => {
  try {
    const { action } = event;

    if (action === "createCollections") {
      return await createCollections();
    } else if (action === "createIndexes") {
      return await createIndexes();
    } else if (action === "seedData") {
      return await seedData();
    }

    return {
      success: false,
      message: "未知操作",
    };
  } catch (error) {
    console.error("错误:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// 创建集合
async function createCollections() {
  const collections = [
    "users",
    "news",
    "ai_analysis",
    "venues",
    "venue_reviews",
    "events",
    "event_registrations",
    "coaches",
    "coach_videos",
    "bookings",
    "comments",
    "collections",
  ];

  const results = [];
  for (const collectionName of collections) {
    try {
      const result = await db.createCollection(collectionName);
      results.push({
        collection: collectionName,
        success: true,
      });
    } catch (error) {
      results.push({
        collection: collectionName,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    success: true,
    message: "集合创建完成",
    results,
  };
}

// 创建索引
async function createIndexes() {
  const indexes = {
    users: [
      { uid: 1, unique: true },
      { phone: 1, unique: true },
      { city: 1 },
      { level: 1 },
      { points: -1 },
      { createdAt: -1 },
    ],
    news: [
      { category: 1 },
      { status: 1 },
      { isPinned: -1 },
      { views: -1 },
      { createdAt: -1 },
    ],
    ai_analysis: [
      { userId: 1 },
      { analysisType: 1 },
      { status: 1 },
      { overallScore: -1 },
      { createdAt: -1 },
    ],
    venues: [
      { ownerId: 1 },
      { city: 1 },
      { district: 1 },
      { status: 1 },
      { verified: 1 },
      { rating: -1 },
      { viewCount: -1 },
      { createdAt: -1 },
    ],
    events: [
      { organizerId: 1 },
      { venueId: 1 },
      { city: 1 },
      { status: 1 },
      { category: 1 },
      "schedule.startDate": 1,
      { createdAt: -1 },
    ],
    coaches: [
      { userId: 1 },
      { city: 1 },
      { specialties: 1 },
      { experience: -1 },
      { rating: -1 },
      { viewCount: -1 },
      { status: 1 },
      { verified: 1 },
    ],
    comments: [
      { targetType: 1 },
      { targetId: 1 },
      { userId: 1 },
      { parentId: 1 },
      { createdAt: -1 },
    ],
  };

  const results = [];
  for (const [collectionName, indexList] of Object.entries(indexes)) {
    try {
      const result = await db.collection(collectionName).createIndexes(indexList);
      results.push({
        collection: collectionName,
        success: true,
      });
    } catch (error) {
      results.push({
        collection: collectionName,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    success: true,
    message: "索引创建完成",
    results,
  };
}

// 插入测试数据
async function seedData() {
  const testData = {
    news: [
      {
        title: "赵心童夺冠创历史！中国选手首次问鼎世锦赛",
        summary:
          "赵心童在2026年斯诺克世锦赛中以13:11击败对手，成为中国首位世锦赛冠军。",
        content: "<p>2026年4月1日，斯诺克世锦赛决赛落幕...</p>",
        category: "赛事",
        source: "台球HQ",
        status: "已发布",
        views: 12000,
        likes: 328,
        comments: 156,
        isPinned: true,
        createdAt: new Date("2026-04-01"),
        updatedAt: new Date("2026-04-01"),
      },
      {
        title: "新手必看！5个台球入门基础动作详解",
        summary: "台球入门需要掌握的5个基础动作：握杆、站位、瞄准、发力、收杆。",
        content: "<p>台球是一项需要精确控制的技术运动...</p>",
        category: "技巧",
        source: "GoldNine原创",
        status: "已发布",
        views: 8560,
        likes: 89,
        comments: 45,
        isPinned: false,
        createdAt: new Date("2026-03-31"),
        updatedAt: new Date("2026-03-31"),
      },
    ],
    venues: [
      {
        name: "金桌球俱乐部",
        address: "北京市朝阳区建国路88号",
        city: "北京市",
        district: "朝阳区",
        phone: "010-12345678",
        hours: {
          open: "09:00",
          close: "23:00",
        },
        facilities: {
          chineseTables: 12,
          americanTables: 8,
          englishTables: 0,
          ac: true,
          wifi: true,
          catering: true,
          lounge: true,
          shop: false,
        },
        pricing: {
          standard: {
            chinese: 30,
            american: 25,
          },
          member: {
            monthly: 299,
            quarterly: 799,
            yearly: 2599,
          },
        },
        rating: 4.8,
        ratingCount: 328,
        status: "营业中",
        verified: true,
        viewCount: 2560,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    events: [
      {
        title: "2026春季城市台球联赛",
        category: "业余",
        type: "中式",
        status: "报名中",
        venueId: "test-venue-1",
        venueName: "金桌球俱乐部",
        prize: {
          total: 5000,
          distribution: ["第1名￥3000", "第2名￥1500", "第3名￥500"],
        },
        registration: {
          fee: 50,
          maxPlayers: 100,
          currentPlayers: 86,
          deadline: new Date("2026-04-10"),
        },
        schedule: {
          startDate: new Date("2026-04-15T09:00:00"),
          endDate: new Date("2026-04-15T18:00:00"),
        },
        rules: "采用中国台球协会中式台球竞赛规则，单败淘汰赛制，三局两胜。",
        requirements: ["年龄16-60岁", "需缴纳报名费￥50"],
        description: "欢迎广大台球爱好者参加！",
        viewCount: 1890,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    coaches: [
      {
        userId: "test-user-1",
        name: "王教练",
        bio: "从事台球教学8年，培养出多名省级冠军选手，擅长斯诺克和青少年培训。",
        qualifications: ["国家一级教练", "省级冠军"],
        experience: 8,
        studentsCount: 300,
        satisfaction: 98,
        specialties: ["斯诺克", "青少年培训"],
        pricing: {
          beginner: 150,
          advanced: 200,
          professional: 300,
          youth: 180,
        },
        partnerVenues: ["test-venue-1"],
        rating: 4.9,
        ratingCount: 156,
        status: "正常",
        verified: true,
        viewCount: 3250,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const results = [];
  for (const [collectionName, data] of Object.entries(testData)) {
    try {
      const result = await db.collection(collectionName).add(data);
      results.push({
        collection: collectionName,
        success: true,
        count: data.length,
      });
    } catch (error) {
      results.push({
        collection: collectionName,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    success: true,
    message: "测试数据插入完成",
    results,
  };
}
