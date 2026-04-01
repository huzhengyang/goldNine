# CloudBase 配置总结 - 快速指南

## ✅ 已完成的工作

### 1. 项目搭建
- ✅ Next.js 14 + TypeScript + Tailwind CSS 项目创建完成
- ✅ CloudBase SDK 集成完成
- ✅ 开发服务器已启动（http://localhost:3000）

### 2. 云函数代码
- ✅ `init-database` - 数据库初始化云函数
- ✅ `ai-analysis` - AI 视频分析云函数

### 3. 配置文档
- ✅ 数据库设计文档（12个集合）
- ✅ CloudBase 配置指南
- ✅ 配置向导脚本（Windows + Linux）

---

## 📋 你需要手动完成的配置

由于 CloudBase MCP 未配置，以下步骤需要你手动在浏览器中完成：

### 步骤 1：获取环境 ID（5 分钟）

1. **访问 CloudBase 控制台**
   ```
   https://tcb.cloud.tencent.com/dev
   ```

2. **创建或选择环境**
   - 点击"新建环境"
   - 填写信息：
     - 环境名称：`goldnine`
     - 套餐：免费版（基础版）

3. **复制环境 ID**
   - 环境创建后，在首页可以看到环境 ID
   - 格式：`env-xxxx-xxxxx`

4. **配置到项目**
   - 打开 `goldnine/.env.local` 文件
   - 替换 `your-env-id-here` 为你的环境 ID
   ```env
   NEXT_PUBLIC_CLOUDBASE_ENV_ID=env-你的实际ID
   ```

---

### 步骤 2：配置认证服务（10 分钟）

1. **访问认证管理页面**
   ```
   https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/identity
   ```

2. **启用手机号验证码登录**
   - 找到"手机号验证码"
   - 点击"启用"
   - 填写签名：
     - 签名名称：`GoldNine台球`
     - 签名内容：`验证码`
   - 提交审核（1-2 小时）

3. **启用微信登录（可选）**
   - 如果有微信公众号，启用后填入 AppID 和 AppSecret
   - 如果没有，暂时跳过

---

### 步骤 3：创建数据库集合（20 分钟）

1. **访问数据库页面**
   ```
   https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/db/doc
   ```

2. **手动创建 12 个集合**

   按顺序创建以下集合：

   | 序号 | 集合名称 | 说明 |
   |------|----------|------|
   | 1 | `users` | 用户集合 |
   | 2 | `news` | 新闻集合 |
   | 3 | `ai_analysis` | AI 分析记录 |
   | 4 | `venues` | 球房集合 |
   | 5 | `venue_reviews` | 球房评价 |
   | 6 | `events` | 赛事集合 |
   | 7 | `event_registrations` | 赛事报名 |
   | 8 | `coaches` | 教练集合 |
   | 9 | `coach_videos` | 教练视频 |
   | 10 | `bookings` | 预约记录 |
   | 11 | `comments` | 评论集合 |
   | 12 | `collections` | 收藏集合 |

3. **创建索引**

   为每个集合创建索引以提高查询性能：

   **users 集合：**
   - `uid` - unique: true
   - `phone` - unique: true
   - `city` - 1
   - `level` - 1

   **news 集合：**
   - `category` - 1
   - `status` - 1
   - `isPinned` - -1
   - `views` - -1
   - `createdAt` - -1

4. **配置安全规则**

   **users 集合：**
   ```json
   {
     "read": "auth.uid != null",
     "write": "auth.uid != null && doc.uid == auth.uid"
   }
   ```

   **news 集合：**
   ```json
   {
     "read": true,
     "write": "auth.uid != null"
   }
   ```

---

### 步骤 4：启用 AI 服务（5 分钟）

1. **访问 AI+ 页面**
   ```
   https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/ai
   ```

2. **启用混元 AI**
   - 找到"混元文本生成模型"
   - 点击"开通"
   - 选择免费版起步

3. **启用 AI 视觉分析**
   - 找到"视觉识别"
   - 点击"开通"
   - 选择免费版起步

---

### 步骤 5：配置云存储（5 分钟）

1. **访问云存储页面**
   ```
   https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/storage
   ```

2. **开通云存储**
   - 点击"开通服务"
   - 选择免费版起步

3. **创建文件夹**
   - `avatars/` - 用户头像
   - `news/` - 新闻图片
   - `venues/` - 球房图片
   - `coaches/` - 教练头像
   - `videos/` - 视频文件

4. **配置存储权限**
   ```json
   {
     "read": true,
     "write": "auth.uid != null"
   }
   ```

---

### 步骤 6：部署云函数（10 分钟）

1. **安装 CloudBase CLI**
   ```bash
   npm install -g @cloudbase/cli
   ```

2. **登录 CloudBase**
   ```bash
   npx @cloudbase/cli login
   ```

3. **部署云函数**
   ```bash
   cd e:/codebuddy/goldnine
   npx @cloudbase/cli functions:deploy
   ```

4. **测试云函数**

   - 访问云函数页面：
     ```
     https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/scf
     ```

   - 找到 `init-database` 函数
   - 点击"云端测试"
   - 输入：
     ```json
     {
       "action": "createCollections"
     }
     ```
   - 点击"运行测试"
   - 查看返回结果

---

### 步骤 7：部署静态托管（10 分钟）

1. **访问静态托管页面**
   ```
   https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/static-hosting
   ```

2. **开通静态托管**
   - 点击"开通服务"
   - 选择免费版起步

3. **构建项目**
   ```bash
   cd e:/codebuddy/goldnine
   npm run build
   ```

4. **部署到 CloudBase**
   ```bash
   npx @cloudbase/cli hosting:deploy
   ```

5. **访问网站**
   - 部署完成后，会生成访问 URL
   - 格式：`https://env-xxxx.tcb.qcloud.la`

---

## 📊 配置完成后检查清单

- [ ] 环境 ID 已配置到 `.env.local`
- [ ] 认证服务已启用（手机号验证码）
- [ ] 12 个数据库集合已创建
- [ ] 所有索引已创建
- [ ] 安全规则已配置
- [ ] AI 服务已启用（混元 AI + 视觉分析）
- [ ] 云存储已开通并创建文件夹
- [ ] 云函数已部署并测试通过
- [ ] 静态托管已开通
- [ ] 网站已成功部署

---

## 🔗 常用管理链接

配置完成后，保存以下链接便于管理：

**控制台首页：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID
```

**数据库管理：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/db/doc
```

**云函数管理：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/scf
```

**云存储管理：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/storage
```

**AI 服务：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/ai
```

**身份认证：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/identity
```

**静态托管：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/static-hosting
```

**日志监控：**
```
https://tcb.cloud.tencent.com/dev?envId=你的环境ID#/devops/log
```

---

## 💡 提示

1. **免费额度**
   - CloudBase 免费版有一定额度，初期足够使用
   - 超过后会按量计费

2. **审核时间**
   - 手机号签名审核需要 1-2 小时
   - 配置后可以先开发其他功能

3. **数据安全**
   - 生产环境必须配置安全规则
   - 不要在前端暴露环境 ID（使用 `.env.local`）

4. **部署流程**
   - 先部署后端（云函数）
   - 再部署前端（静态托管）
   - 确保前端 API 地址正确

---

## 🚀 配置完成后的下一步

1. **测试登录功能**
   - 在本地访问 `http://localhost:3000`
   - 测试手机号验证码登录

2. **测试数据库连接**
   - 检查控制台是否有数据
   - 测试查询接口

3. **测试 AI 功能**
   - 上传测试视频
   - 检查分析结果

4. **继续开发其他页面**
   - 新闻系统
   - 球房系统
   - 赛事系统
   - 助教系统

---

## 📞 需要帮助？

如果遇到问题，可以：

1. **查看文档**
   - [CloudBase 官方文档](https://cloud.tencent.com/document/product/876)
   - [项目 README](./README.md)
   - [数据库设计文档](./数据库设计.md)

2. **检查日志**
   - 云函数日志：控制台 → 云函数 → 日志
   - 静态托管日志：控制台 → 日志监控

3. **联系支持**
   - 腾讯云工单系统
   - 腾讯云技术支持群

---

**祝你配置顺利！** 🎉
