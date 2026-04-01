# GoldNine 项目 - CloudBase 配置完成总结

**配置时间：** 2026-04-01  
**环境ID：** `bluetooth-website-3eyhlocfe7b405`  
**环境别名：** `bluetooth-website`  
**套餐：** 个人版（免费）

---

## ✅ 已完成配置

### 1. CloudBase MCP 配置
- ✅ 安装并配置 CloudBase MCP 服务器
- ✅ 成功连接到 CloudBase 环境
- ✅ MCP 工具可用（31个工具）

### 2. 项目环境配置
- ✅ 更新 `.env.local` 文件
- ✅ 设置环境ID: `bluetooth-website-3eyhlocfe7b405`
- ✅ 设置区域: `ap-shanghai`

### 3. 数据库集合创建
已创建 **12个** 业务集合：

| 集合名称 | 说明 | 安全规则 |
|---------|------|---------|
| `users` | 用户信息 | ADMINWRITE（仅管理员可写） |
| `news` | 新闻资讯 | READONLY（所有人可读） |
| `ai_analysis` | AI动作分析记录 | PRIVATE（仅创建者可访问） |
| `venues` | 球房信息 | READONLY（所有人可读） |
| `events` | 赛事信息 | READONLY（所有人可读） |
| `coaches` | 助教/教练信息 | READONLY（所有人可读） |
| `bookings` | 预约记录 | PRIVATE（仅创建者可访问） |
| `comments` | 评论 | ADMINWRITE（仅管理员可写） |
| `likes` | 点赞记录 | ADMINWRITE（仅管理员可写） |
| `favorites` | 收藏记录 | PRIVATE（仅创建者可访问） |
| `user_events` | 用户参赛记录 | PRIVATE（仅创建者可访问） |
| `advertisements` | 广告信息 | READONLY（所有人可读） |

### 4. CloudBase 服务状态
- ✅ 数据库（NoSQL）：已开通
- ✅ 云存储：已开通
- ✅ 云函数：已开通
- ✅ 静态托管：已开通
- ✅ 日志服务：已开通

---

## ⚠️ 需要手动配置的服务

### 1. 认证服务配置（重要！）

**访问地址：**  
https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/identity/login-manage

**需要启用的登录方式：**

#### A. 手机号验证码登录（必选）
1. 进入身份认证 → 登录管理
2. 找到"手机号"登录方式
3. 点击"启用"
4. 配置短信模板（可选，使用默认模板即可）

#### B. 微信授权登录（可选）
1. 进入身份认证 → 登录管理
2. 找到"微信"登录方式
3. 点击"启用"
4. 需要提供微信开放平台 AppID 和 AppSecret
5. 如无微信开放平台账号，可暂时不启用

#### C. 匿名登录（可选，用于临时用户）
1. 进入身份认证 → 登录管理
2. 找到"匿名登录"
3. 点击"启用"

---

### 2. AI 服务配置（重要！）

**访问地址：**  
https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/ai

**需要启用的服务：**

#### A. 混元 AI（必选 - 用于新闻改写、生成摘要）
1. 进入 AI+ → 模型服务
2. 找到"混元大模型"
3. 点击"开通服务"
4. 选择免费额度（个人版每月有免费调用次数）

#### B. AI 视觉分析（必选 - 用于视频动作分析）
1. 进入 AI+ → 视觉服务
2. 找到"人体分析"或"姿态识别"
3. 点击"开通服务"
4. 选择免费额度（个人版每月有免费调用次数）

**注意：** AI 服务需要单独开通，首次开通需要实名认证。

---

### 3. 安全域名配置

**访问地址：**  
https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/env/domain

**需要添加的域名：**

#### 开发环境
- `http://localhost:3000`（本地开发）
- `http://127.0.0.1:3000`

#### 生产环境（部署后添加）
- `https://goldnine.cn`
- `https://www.goldnine.cn`

**添加步骤：**
1. 进入环境设置 → 安全配置
2. 点击"添加域名"
3. 选择域名类型（Web SDK 域名）
4. 输入域名并保存

---

## 📝 下一步操作

### 1. 完成认证和AI服务配置（10分钟）
按照上面的指引，在 CloudBase 控制台完成配置。

### 2. 测试数据库连接
运行开发服务器，测试是否能正常连接数据库：
```bash
cd e:/codebuddy/goldnine
npm run dev
```

### 3. 继续开发其他页面
建议的开发顺序：
1. **用户系统** - 登录/注册/个人中心
2. **新闻系统** - 列表/详情页
3. **AI动作分析** - 上传/分析页
4. **球房系统** - 列表/详情页
5. **赛事系统** - 列表/详情/报名页
6. **助教系统** - 列表/详情/预约页

---

## 🔧 CloudBase 控制台入口

| 功能 | 访问地址 |
|------|---------|
| **环境概览** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/overview |
| **数据库** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/db/doc |
| **云函数** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/scf |
| **云存储** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/storage |
| **身份认证** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/identity |
| **AI服务** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/ai |
| **静态托管** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/static-hosting |
| **日志监控** | https://tcb.cloud.tencent.com/dev?envId=bluetooth-website-3eyhlocfe7b405#/devops/log |

---

## 💰 费用说明

### 个人版免费额度（每月）
- **数据库：** 2GB 存储 + 5万次读写/天
- **云存储：** 5GB 存储 + 5GB 流量
- **云函数：** 4万GBs 资源使用量 + 1000万次调用
- **静态托管：** 5GB 存储 + 5GB 流量
- **AI服务：** 混元 AI 有免费额度，视觉 AI 有免费额度

### 预估费用（1000用户/月）
- **存储：** 免费额度足够
- **流量：** 免费额度足够
- **AI分析：** 约 ¥620（可通过会员费覆盖）

**建议：** 先使用免费额度测试，用户量增长后再考虑升级套餐。

---

## ✨ 配置完成检查清单

- [x] CloudBase MCP 配置
- [x] 环境连接
- [x] 项目环境变量配置
- [x] 数据库集合创建（12个）
- [x] 数据库安全规则配置
- [ ] 认证服务配置（手机号登录）
- [ ] 认证服务配置（微信登录，可选）
- [ ] AI 服务配置（混元 AI）
- [ ] AI 服务配置（视觉分析）
- [ ] 安全域名配置（开发环境）
- [ ] 安全域名配置（生产环境，部署后）

---

## 🎯 总结

**CloudBase 后端服务已基本配置完成！**

- ✅ 数据库已就绪
- ✅ 安全规则已配置
- ✅ MCP 工具可用

**接下来需要你手动完成：**
1. 认证服务配置（5分钟）
2. AI 服务配置（5分钟）
3. 安全域名配置（3分钟）

完成后即可开始开发业务功能！

---

**配置完成后，告诉我，我将继续开发其他页面！** 🚀
