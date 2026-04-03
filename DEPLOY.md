# GoldNine 部署指南

## 部署到 goldnine.cn

### 方案一：CloudBase CloudRun 部署（推荐）

#### 1. 安装 CloudBase CLI
```bash
npm install -g @cloudbase/cli
```

#### 2. 登录 CloudBase
```bash
tcb login
```

#### 3. 部署到 CloudRun
```bash
cd e:\codebuddy\goldnine
tcb fn deploy --name goldnine-web --runtime nodejs18 --handler index.main
```

或者使用容器化部署：

```bash
# 构建镜像
docker build -t goldnine-web .

# 推送到腾讯云镜像仓库
docker tag goldnine-web ccr.ccs.tencentyun.com/your-namespace/goldnine-web:latest
docker push ccr.ccs.tencentyun.com/your-namespace/goldnine-web:latest

# 部署到CloudRun
tcb run deploy --name goldnine-web --image ccr.ccs.tencentyun.com/your-namespace/goldnine-web:latest
```

#### 4. 配置域名
1. 登录 CloudBase 控制台：https://tcb.cloud.tencent.com/
2. 选择环境：bluetooth-website-3eyhlocfe7b405
3. 进入"云托管" → "服务管理" → "goldnine-web"
4. 点击"访问配置" → "自定义域名"
5. 添加域名：goldnine.cn
6. 按照提示完成域名解析配置

---

### 方案二：Vercel 部署（简单快速）

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 部署
```bash
cd e:\codebuddy\goldnine
vercel --prod
```

#### 3. 配置自定义域名
1. 登录 Vercel Dashboard
2. 选择项目 → Settings → Domains
3. 添加 goldnine.cn
4. 配置 DNS 解析

---

### 方案三：静态托管部署

如果只需要静态页面（不需要API功能），可以导出静态文件：

#### 1. 修改配置
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true }
};
```

#### 2. 构建静态文件
```bash
npm run build
```

#### 3. 上传到CloudBase静态托管
```bash
tcb hosting deploy ./out -e bluetooth-website-3eyhlocfe7b405
```

---

## 环境变量配置

确保以下环境变量已配置：

```env
NEXT_PUBLIC_CLOUDBASE_ENV_ID=bluetooth-website-3eyhlocfe7b405
NEXT_PUBLIC_APP_NAME=GoldNine
NEXT_PUBLIC_APP_DOMAIN=goldnine.cn
```

---

## 域名解析配置

### 添加DNS记录：

```
类型: CNAME
主机记录: @
记录值: [CloudBase提供的域名]
TTL: 600
```

```
类型: CNAME
主机记录: www
记录值: [CloudBase提供的域名]
TTL: 600
```

---

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 新闻列表可以加载
- [ ] 球房列表可以加载
- [ ] 赛事列表可以加载
- [ ] 教练列表可以加载
- [ ] 所有详情页可以访问
- [ ] 用户登录功能正常
- [ ] AI分析功能正常

---

## 当前部署状态

✅ 前端代码已构建完成  
⏳ 等待部署到 CloudRun  
⏳ 等待配置域名 goldnine.cn  

---

## 推荐操作

**最简单的部署方式：**

1. 使用 Vercel 部署（免费，快速）
2. 在 Vercel 配置域名 goldnine.cn
3. 测试所有功能正常后，再迁移到 CloudBase

**命令：**
```bash
cd e:\codebuddy\goldnine
vercel --prod
```

Vercel 会自动：
- 构建项目
- 部署到全球 CDN
- 提供 HTTPS
- 支持自定义域名

部署后您会获得一个 `.vercel.app` 域名，可以在 Vercel 控制台添加自定义域名 goldnine.cn。
