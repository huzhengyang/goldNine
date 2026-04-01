# GoldNine 台球门户网站

## 项目简介

GoldNine 是一个基于 AI 的台球智能服务平台，提供新闻资讯、AI 动作分析、球房预订、赛事报名、教练预约等功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **图标**: Lucide React
- **后端**: 腾讯云 CloudBase
- **数据库**: CloudBase NoSQL
- **认证**: CloudBase Auth
- **AI**: 腾讯混元 AI

## 项目结构

```
goldnine/
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/          # React 组件
│   ├── lib/               # 工具函数
│   ├── store/             # Zustand 状态管理
│   └── types/             # TypeScript 类型定义
├── public/               # 静态资源
├── cloudfunctions/        # CloudBase 云函数
├── 数据库设计.md          # 数据库设计文档
├── 产品需求文档-PRD.md   # 产品需求文档
├── UI设计规范.md         # UI 设计规范
├── 页面设计稿.md         # 页面设计稿
└── README.md             # 项目说明
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.local.example .env.local
```

2. 配置 CloudBase 环境变量（在 `.env.local` 中）：
```env
NEXT_PUBLIC_CLOUDBASE_ENV_ID=your-env-id-here
```

3. 获取 CloudBase 环境ID：
   - 登录 [腾讯云 CloudBase 控制台](https://tcb.cloud.tencent.com/dev)
   - 选择或创建环境
   - 复制环境ID

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建项目

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## CloudBase 配置

### 数据库创建

在 CloudBase 控制台创建以下集合：

1. `users` - 用户集合
2. `news` - 新闻集合
3. `ai_analysis` - AI 分析记录集合
4. `venues` - 球房集合
5. `venue_reviews` - 球房评价集合
6. `events` - 赛事集合
7. `event_registrations` - 赛事报名集合
8. `coaches` - 教练集合
9. `coach_videos` - 教练视频集合
10. `bookings` - 预约集合
11. `comments` - 评论集合
12. `collections` - 收藏集合

详细结构请参考 [数据库设计.md](./数据库设计.md)

### 认证配置

在 CloudBase 控制台配置认证方式：

1. 启用手机号验证码登录
2. 启用微信授权登录
3. 启用匿名登录（可选）

### AI 服务配置

在 CloudBase 控制台启用 AI 服务：

1. 启用混元 AI 文本生成
2. 启用 AI 视觉分析（人体关键点检测）

## 功能模块

### 第一期功能（MVP）

- ✅ 用户系统（注册/登录/个人中心）
- ✅ 新闻资讯（列表/详情/自动抓取/AI 改写）
- ✅ AI 动作分析（视频上传/基础分析/报告生成）
- ✅ 球房系统（列表/详情/基础信息展示）
- ✅ 赛事系统（列表/详情/报名功能）
- ✅ 助教系统（列表/详情/视频展示/预约）

### 第二期功能（增强）

- ⏳ 球房在线预订 + AR 实景预览
- ⏳ 赛事积分系统 + 赛程管理
- ⏳ 助教在线教学 + AI 教学助手
- ⏳ 广告系统

### 第三期功能（生态）

- ⏳ 商城系统
- ⏳ 直播系统
- ⏳ 智能匹配系统
- ⏳ 跨球房联赛

## 部署

### 部署到 CloudBase 静态托管

1. 构建项目：
```bash
npm run build
```

2. 部署到 CloudBase：
```bash
# 使用 CloudBase CLI
cloudbase hosting:deploy
```

3. 访问部署的 URL

## 文档

- [产品需求文档](./产品需求文档-PRD.md) - 详细的功能需求和项目规划
- [UI 设计规范](./UI设计规范.md) - 设计规范和组件指南
- [页面设计稿](./页面设计稿.md) - 所有页面的详细设计
- [数据库设计](./数据库设计.md) - 数据库集合和索引设计

## 开发进度

### 第一期（Week 1-4）
- [x] 项目初始化
- [x] 首页开发
- [ ] 新闻系统开发
- [ ] AI 动作分析开发
- [ ] 球房系统开发
- [ ] 赛事系统开发
- [ ] 助教系统开发
- [ ] 测试和优化
- [ ] 部署上线

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

- 项目地址: https://github.com/your-username/goldnine
- 官网: https://goldnine.cn
- 邮箱: contact@goldnine.cn

---

**版本：** v1.0
**最后更新：** 2026-04-01
