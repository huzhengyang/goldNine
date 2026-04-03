// CloudBase 云函数：API 中间层（数据库访问）
const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: cloudbase.getCurrentEnv(),
});

const db = app.database();

// HTTP 函数入口
exports.main = async (event, context) => {
  // 设置 CORS 头
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // 处理 OPTIONS 预检请求
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // 解析查询参数
    const query = event.queryStringParameters || {};
    const { collection, action, id, limit = 20, offset = 0, ...filters } = query;

    if (!collection) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "缺少 collection 参数",
        }),
      };
    }

    // 获取单个文档
    if (action === "get" && id) {
      return await getOne(collection, id, headers);
    }

    // 列表查询
    return await getList(collection, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters,
      headers,
    });
  } catch (error) {
    console.error("API 错误:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.message,
      }),
    };
  }
};

// 获取单个文档
async function getOne(collectionName, id, headers) {
  try {
    const result = await db.collection(collectionName).doc(id).get();

    if (!result.data || result.data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: "文档不存在",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result.data[0] || result.data,
      }),
    };
  } catch (error) {
    throw error;
  }
}

// 获取列表
async function getList(collectionName, { limit, offset, filters, headers }) {
  try {
    let query = db.collection(collectionName);

    // 应用过滤条件
    const filterObj = {};

    // 处理状态过滤
    if (filters.status) {
      filterObj.status = filters.status;
    }

    // 处理分类过滤
    if (filters.category) {
      filterObj.category = filters.category;
    }

    // 处理城市过滤
    if (filters.city) {
      filterObj.city = filters.city;
    }

    // 处理专区过滤
    if (filters.district) {
      filterObj.district = filters.district;
    }

    // 应用过滤
    if (Object.keys(filterObj).length > 0) {
      query = query.where(filterObj);
    }

    // 获取总数
    const countResult = await query.count();

    // 排序（默认按创建时间倒序）
    const orderBy = filters.orderBy || "createdAt";
    const order = filters.order || "desc";

    // 获取数据
    const result = await query
      .orderBy(orderBy, order)
      .skip(offset)
      .limit(limit)
      .get();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result.data,
        total: countResult.total,
        limit,
        offset,
      }),
    };
  } catch (error) {
    throw error;
  }
}
