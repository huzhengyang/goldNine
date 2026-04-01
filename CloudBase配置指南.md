# CloudBase 配置指南

本文档将指导你完成 CloudBase 的完整配置，让 GoldNine 项目能够正常运行。

---

## 一、创建 CloudBase 环境

### 1.1 注册和登录

1. 访问 [腾讯云 CloudBase 控制台](https://tcb.cloud.tencent.com/dev)
2. 如果没有腾讯云账号，先注册
3. 登录后进入 CloudBase 控制台

### 1.2 创建环境

1. 点击 **"新建环境"** 按钮
2. 填写环境信息：
   - **环境名称**: `goldnine`
   - **基础版** 或 **进阶版**（根据需求选择）
   - **套餐**: 免费版起步，后期升级
3. 点击 **"创建"** 按钮
4. 等待环境创建完成（通常 1-2 分钟）

### 1.3 获取环境ID

1. 环境创建完成后，在控制台首页可以看到环境信息
2. 复制 **环境ID**（格式：`env-xxxx-xxxxx`）
3. 将环境ID粘贴到项目的 `.env.local` 文件中：

```env
NEXT_PUBLIC_CLOUDBASE_ENV_ID=env-你的环境ID
```

---

## 二、配置认证服务

### 2.1 开启认证方式

1. 在 CloudBase 控制台左侧菜单中，点击 **"身份认证"**
2. 进入 **"登录管理"** 页面
3. 开启以下认证方式：

#### 2.1.1 手机号验证码登录
1. 找到 **"手机号验证码"** 选项
2. 点击 **"启用"** 按钮
3. 填写签名信息：
   - **签名名称**: GoldNine台球
   - **签名内容**: 验证码
4. 提交审核（腾讯云审核通常 1-2 小时）

#### 2.1.2 微信授权登录
1. 找到 **"微信"** 选项
2. 点击 **"启用"** 按钮
3. 填写微信公众号信息：
   - **AppID**: 从微信公众平台获取
   - **AppSecret**: 从微信公众平台获取
4. 如果没有微信公众号，暂时跳过此步骤

#### 2.1.3 匿名登录（可选）
1. 找到 **"匿名登录"** 选项
2. 点击 **"启用"** 按钮

### 2.2 配置用户信息

1. 进入 **"用户管理"** 页面
2. 可以查看已注册用户
3. 可以禁用违规用户

---

## 三、配置数据库

### 3.1 创建集合

有两种方式创建集合：

#### 方式一：手动创建（推荐新手）

1. 在控制台左侧菜单，点击 **"文档型数据库"**
2. 点击 **"添加集合"** 按钮
3. 输入集合名称，例如：`users`
4. 选择权限规则：
   - **读权限**: `auth.uid != null`（登录用户可读）
   - **写权限**: `doc.uid == auth.uid`（只能修改自己的数据）
5. 点击 **"确定"** 创建

按照以下列表创建所有集合：

| 序号 | 集合名称 | 说明 |
|-----|----------|------|
| 1 | users | 用户集合 |
| 2 | news | 新闻集合 |
| 3 | ai_analysis | AI 分析记录集合 |
| 4 | venues | 球房集合 |
| 5 | venue_reviews | 球房评价集合 |
| 6 | events | 赛事集合 |
| 7 | event_registrations | 赛事报名集合 |
| 8 | coaches | 教练集合 |
| 9 | coach_videos | 教练视频集合 |
| 10 | bookings | 预约集合 |
| 11 | comments | 评论集合 |
| 12 | collections | 收藏集合 |

#### 方式二：使用云函数批量创建

1. 部署 `init-database` 云函数（见下文）
2. 调用云函数创建所有集合

### 3.2 创建索引

索引可以提高查询性能，必须创建：

#### users 集合索引
```json
[
  { "uid": 1, "unique": true },
  { "phone": 1, "unique": true },
  { "city": 1 },
  { "level": 1 },
  { "points": -1 },
  { "createdAt": -1 }
]
```

#### news 集合索引
```json
[
  { "category": 1 },
  { "status": 1 },
  { "isPinned": -1 },
  { "views": -1 },
  { "createdAt": -1 }
]
```

#### 其他集合索引

参考 [数据库设计.md](./数据库设计.md) 创建所有集合的索引。

### 3.3 配置安全规则

安全规则控制数据访问权限，非常重要！

#### users 集合规则
```json
{
  "read": "auth.uid != null",
  "write": "auth.uid != null && doc.uid == auth.uid"
}
```

#### news 集合规则
```json
{
  "read": true,
  "write": "auth.uid != null"
}
```

#### venues 集合规则
```json
{
  "read": true,
  "write": "doc.ownerId == auth.uid || auth.uid == 'admin'"
}
```

---

## 四、配置 AI 服务

### 4.1 开启混元 AI

1. 在控制台左侧菜单，点击 **"AI+"**
2. 进入 **"AI模型"** 页面
3. 找到 **"混元文本生成模型"**
4. 点击 **"开通"** 按钮
5. 选择套餐（免费版起步）

### 4.2 开启 AI 视觉分析

1. 在 **"AI+"** 页面，找到 **"视觉识别"**
2. 点击 **"开通"** 按钮
3. 选择套餐

### 4.3 配置 API 密钥

1. 在 **"AI+"** 页面，找到 **"访问密钥"**
2. 创建密钥并保存（用于云函数调用）

---

## 五、配置云函数

### 5.1 部署云函数

有两种方式部署云函数：

#### 方式一：使用 CloudBase CLI（推荐）

1. 安装 CLI：
```bash
npm install -g @cloudbase/cli
```

2. 登录：
```bash
cloudbase login
```

3. 部署云函数：
```bash
cd e:/codebuddy/goldnine
cloudbase functions:deploy
```

#### 方式二：手动上传

1. 在控制台左侧菜单，点击 **"云函数"**
2. 点击 **"新建"** 按钮
3. 填写函数信息：
   - **函数名称**: `init-database`
   - **运行环境**: Node.js 16.13
   - **内存**: 256MB
   - **超时时间**: 60s
4. 点击 **"下一步"**，上传函数代码
5. 重复步骤创建 `ai-analysis` 函数

### 5.2 配置环境变量

1. 进入云函数详情页
2. 点击 **"配置"** → **"环境变量"**
3. 添加以下变量：

```env
TENCENT_SECRET_ID=你的SecretId
TENCENT_SECRET_KEY=你的SecretKey
CLOUDBASE_ENV_ID=你的环境ID
```

### 5.3 测试云函数

1. 在云函数详情页，点击 **"云端测试"**
2. 输入测试参数：

```json
{
  "action": "createCollections"
}
```

3. 点击 **"运行测试"**
4. 查看返回结果

---

## 六、配置云存储

### 6.1 开通云存储

1. 在控制台左侧菜单，点击 **"云存储"**
2. 点击 **"开通服务"** 按钮
3. 选择套餐（免费版起步）

### 6.2 配置存储权限

1. 进入云存储页面
2. 点击 **"权限设置"**
3. 配置权限规则：

```json
{
  "read": true,
  "write": "auth.uid != null"
}
```

### 6.3 创建存储桶

1. 点击 **"新建文件夹"**
2. 创建以下文件夹：
   - `avatars/` - 用户头像
   - `news/` - 新闻图片
   - `venues/` - 球房图片
   - `coaches/` - 教练头像
   - `videos/` - 视频文件

---

## 七、部署云函数初始化数据库

### 7.1 调用 init-database 云函数

部署完 `init-database` 云函数后，调用以下操作：

#### 创建所有集合
```json
{
  "action": "createCollections"
}
```

#### 创建所有索引
```json
{
  "action": "createIndexes"
}
```

#### 插入测试数据
```json
{
  "action": "seedData"
}
```

### 7.2 验证结果

1. 回到 **"文档型数据库"** 页面
2. 检查是否创建了所有集合
3. 点击集合查看是否有测试数据

---

## 八、配置静态网站托管

### 8.1 开通静态托管

1. 在控制台左侧菜单，点击 **"静态网站托管"**
2. 点击 **"开通服务"** 按钮
3. 选择套餐（免费版起步）

### 8.2 部署网站

1. 先在本地构建项目：
```bash
cd e:/codebuddy/goldnine
npm run build
```

2. 使用 CLI 部署：
```bash
cloudbase hosting:deploy
```

3. 选择部署目录：`dist`
4. 确认部署

### 8.3 访问网站

部署完成后，会生成访问 URL，例如：
```
https://env-xxxx.tcb.qcloud.la
```

---

## 九、常用管理链接

配置完成后，保存以下链接便于管理：

- **控制台首页**: https://tcb.cloud.tencent.com/dev?envId=${envId}
- **文档型数据库**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/db/doc
- **MySQL数据库**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/db/mysql
- **云函数**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/scf
- **云存储**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/storage
- **AI+**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/ai
- **静态网站托管**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/static-hosting
- **身份认证**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity
- **日志监控**: https://tcb.cloud.tencent.com/dev?envId=${envId}#/devops/log

---

## 十、常见问题

### Q1: 如何获取环境ID？
A: 在 CloudBase 控制台首页，环境信息中可以找到环境ID，格式为 `env-xxxx-xxxxx`。

### Q2: 手机号验证码审核要多久？
A: 腾讯云审核通常需要 1-2 小时，审核通过后才能使用。

### Q3: 如何配置微信登录？
A: 需要先注册微信公众号，获取 AppID 和 AppSecret，然后在 CloudBase 认证配置中填写。

### Q4: AI 服务收费吗？
A: 混元 AI 和视觉识别都有免费额度，超过后按使用量计费。建议先使用免费额度测试。

### Q5: 如何查看云函数日志？
A: 在云函数详情页，点击 **"日志"** 标签，可以查看运行日志。

### Q6: 数据库如何备份？
A: CloudBase 支持自动备份，在数据库页面可以配置备份策略。

---

## 十一、下一步配置指南

完成 CloudBase 配置后，还需要：

1. ✅ 在 `.env.local` 中配置环境ID
2. ✅ 创建所有数据库集合
3. ✅ 创建所有索引
4. ✅ 插入测试数据
5. ✅ 测试云函数
6. ✅ 部署前端到静态托管
7. ✅ 配置自定义域名

---

**配置完成后，项目就可以正常运行了！**

如有问题，请参考 [CloudBase 官方文档](https://cloud.tencent.com/document/product/876)
