const cloud = require('@cloudbase/node-sdk');
const crypto = require('crypto');

const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

// 订单集合名
const ORDERS_COLLECTION = 'shop_orders';
const PRICES_COLLECTION = 'shop_prices';
const ACCOUNTS_COLLECTION = 'kiro_accounts';

// 默认价格
const DEFAULT_PRICES = {
  normal: 9.9,
  '1000i': 19.9,
  '2000': 29.9,
  '10000': 49.9
};

// 生成唯一订单号
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `K${timestamp}${random}`.toUpperCase();
}

exports.main = async (event, context) => {
  const { action } = event;

  try {
    switch (action) {
      case 'getPrices':
        return await getPrices();
      
      case 'savePrices':
        return await savePrices(event.prices);
      
      case 'createOrder':
        return await createOrder(event.accountType, event.price);
      
      case 'checkOrderStatus':
        return await checkOrderStatus(event.orderId);
      
      case 'confirmPayment':
        return await confirmPayment(event.orderId, event.accountId);
      
      case 'getOrders':
        return await getOrders(event.status, event.limit);
      
      default:
        return { code: -1, message: '未知操作' };
    }
  } catch (error) {
    console.error('shop-manager error:', error);
    return { code: -1, message: error.message };
  }
};

// 获取价格配置
async function getPrices() {
  try {
    const result = await db.collection(PRICES_COLLECTION).limit(1).get();
    
    if (result.data && result.data.length > 0) {
      return {
        code: 0,
        data: result.data[0].prices
      };
    }

    // 初始化默认价格
    await db.collection(PRICES_COLLECTION).add({
      prices: DEFAULT_PRICES,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return {
      code: 0,
      data: DEFAULT_PRICES
    };
  } catch (error) {
    console.error('获取价格失败:', error);
    throw error;
  }
}

// 保存价格配置
async function savePrices(prices) {
  if (!prices || typeof prices !== 'object') {
    return { code: -1, message: '无效的价格数据' };
  }

  try {
    // 查找现有配置
    const existing = await db.collection(PRICES_COLLECTION).limit(1).get();

    if (existing.data && existing.data.length > 0) {
      // 更新现有配置
      await db.collection(PRICES_COLLECTION)
        .doc(existing.data[0]._id)
        .update({
          prices: prices,
          updatedAt: new Date().toISOString()
        });
    } else {
      // 创建新配置
      await db.collection(PRICES_COLLECTION).add({
        prices: prices,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return { code: 0, message: '价格已更新' };
  } catch (error) {
    console.error('保存价格失败:', error);
    throw error;
  }
}

// 创建订单
async function createOrder(accountType, price) {
  if (!accountType || !['normal', '1000i', '2000', '10000'].includes(accountType)) {
    return { code: -1, message: '无效的账户类型' };
  }

  // 检查库存（未售出的同类型账户）
  let availableAccount = null;
  
  try {
    // 从账户集合查找可用账户
    const accountResult = await db.collection(ACCOUNTS_COLLECTION)
      .where({
        accountType: accountType,
        googleSold: _.neq(true),
        amazonSold: _.neq(true),
        githubSold: _.neq(true)
      })
      .limit(1)
      .get();

    if (accountResult.data && accountResult.data.length > 0) {
      availableAccount = accountResult.data[0];
    }
  } catch (e) {
    console.log('查询库存出错:', e);
  }

  if (!availableAccount) {
    return { 
      code: -1, 
      message: `该商品类型(${accountType})暂无可用库存` 
    };
  }

  const orderId = generateOrderId();
  const orderData = {
    orderId: orderId,
    accountType: accountType,
    accountId: availableAccount.id || availableAccount._id,
    price: parseFloat(price) || DEFAULT_PRICES[accountType],
    status: 'pending', // pending -> paid -> delivered
    accountInfo: {
      email: availableAccount.email,
      password: availableAccount.password,
      receiveCodeUrl: availableAccount.receiveCodeUrl || '',
      twoFaCode: availableAccount.twoFaCode || '',
      name: availableAccount.name
    },
    createdAt: new Date().toISOString(),
    paidAt: null,
    deliveredAt: null,
    shareUrl: null
  };

  try {
    const result = await db.collection(ORDERS_COLLECTION).add(orderData);

    return {
      code: 0,
      message: '订单创建成功',
      data: {
        order: {
          id: result.id,
          ...orderData
        },
        message: '请扫码付款后等待确认'
      }
    };
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
}

// 检查订单状态
async function checkOrderStatus(orderId) {
  if (!orderId) {
    return { code: -1, message: '缺少订单ID' };
  }

  try {
    // 查找订单
    const result = await db.collection(ORDERS_COLLECTION)
      .where({ _id: orderId })
      .limit(1)
      .get();

    if (!result.data || result.data.length === 0) {
      return { code: -1, message: '订单不存在' };
    }

    const order = result.data[0];

    return {
      code: 0,
      data: {
        order: {
          id: order._id,
          orderId: order.orderId,
          accountType: order.accountType,
          price: order.price,
          status: order.status,
          shareUrl: order.shareUrl,
          createdAt: order.createdAt
        }
      }
    };
  } catch (error) {
    console.error('查询订单状态失败:', error);
    throw error;
  }
}

// 确认支付（管理员操作）
async function confirmPayment(orderId, accountId) {
  if (!orderId) {
    return { code: -1, message: '缺少订单ID' };
  }

  try {
    // 查找订单
    const orderResult = await db.collection(ORDERS_COLLECTION)
      .where({ _id: orderId })
      .limit(1)
      .get();

    if (!orderResult.data || orderResult.data.length === 0) {
      return { code: -1, message: '订单不存在' };
    }

    const order = orderResult.data[0];

    if (order.status !== 'pending') {
      return { code: -1, message: '该订单已经处理过' };
    }

    // 生成分享链接 token
    const tokenData = JSON.stringify({
      email: order.accountInfo.email,
      password: order.accountInfo.password,
      platform: 'google', // 默认平台，可根据需求调整
      receiveCodeUrl: order.accountInfo.receiveCodeUrl || '',
      twoFaCode: order.accountInfo.twoFaCode || '',
      expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000 // 2天有效期
    });

    const token = Buffer.from(tokenData).toString('base64');
    const shareUrl = `${process.env.TCB_HOSTING_URL || ''}/kiro/share?token=${token}`;

    // 更新订单状态
    const now = new Date().toISOString();
    await db.collection(ORDERS_COLLECTION)
      .doc(order._id)
      .update({
        status: 'delivered',
        paidAt: now,
        deliveredAt: now,
        shareUrl: shareUrl
      });

    // 标记账户为已售出
    const accId = accountId || order.accountId;
    if (accId) {
      try {
        await db.collection(ACCOUNTS_COLLECTION)
          .where({ _id: accId })
          .update({
            googleSold: true
          });
      } catch (e) {
        console.log('标记账户售出失败:', e);
      }
    }

    return {
      code: 0,
      message: '发货成功',
      data: {
        order: {
          id: order._id,
          orderId: order.orderId,
          status: 'delivered',
          shareUrl: shareUrl
        }
      }
    };
  } catch (error) {
    console.error('确认支付失败:', error);
    throw error;
  }
}

// 获取订单列表（管理端）
async function getOrders(status, limit = 50) {
  try {
    let query = db.collection(ORDERS_COLLECTION);

    if (status && ['pending', 'paid', 'delivered', 'cancelled'].includes(status)) {
      query = query.where({ status: status });
    }

    const result = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return {
      code: 0,
      data: result.data.map(order => ({
        id: order._id,
        orderId: order.orderId,
        accountType: order.accountType,
        price: order.price,
        status: order.status,
        accountEmail: order.accountInfo?.email,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        deliveredAt: order.deliveredAt,
        shareUrl: order.shareUrl
      }))
    };
  } catch (error) {
    console.error('获取订单列表失败:', error);
    throw error;
  }
}
