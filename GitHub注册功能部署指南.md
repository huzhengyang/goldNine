# GitHub 注册功能部署指南

## 问题原因
数据库集合 `github_register_tasks` 不存在，导致 GitHub 注册功能报错。

## 解决方案
已修改云函数代码，添加自动创建集合功能，需要重新部署云函数。

## 部署步骤（必须执行）

### 方法一：使用命令行（推荐）

1. 打开命令行，进入项目目录：
   ```bash
   cd e:\codebuddy\goldnine
   ```

2. 执行部署命令：
   ```bash
   tcb fn deploy github-register-task
   ```

3. 选择环境：
   - 使用方向键选择 `goldnine-hk`
   - 按 Enter 确认

4. 选择操作：
   - 选择 `使用合并配置更新`
   - 按 Enter 确认

5. 等待部署完成（约 10-30 秒）

### 方法二：双击批处理文件

1. 双击运行：`e:\codebuddy\goldnine\deploy-github-task.bat`
2. 按照提示选择环境和配置
3. 等待部署完成

## 验证部署

部署完成后，运行测试脚本验证：

```bash
cd e:\codebuddy\goldnine
node test-after-deploy.js
```

预期输出：
```
✓ 匿名登录成功
✓ 任务创建成功！任务ID: xxx
✓ 所有测试通过！
```

## 测试前端功能

部署成功后，访问页面测试：
https://goldnine-hk-8g3g5ijhec9df56e-1255523606.tcloudbaseapp.com/kiro

1. 登录账户管理页面
2. 点击任意账户展开详情
3. 点击"注册 GitHub"按钮
4. 查看是否正常创建任务

## 已修改的文件

- `cloudfunctions/github-register-task/index.js` - 添加自动创建集合功能

## 技术说明

修改后的云函数会在第一次运行时：
1. 检查集合 `github_register_tasks` 是否存在
2. 如果不存在，自动创建集合
3. 然后执行后续操作

这样就不需要手动在控制台创建集合了。

## 如有问题

如果部署失败，请检查：
1. 是否已登录 CloudBase CLI：`tcb login`
2. 是否有权限访问环境：`goldnine-hk-8g3g5ijhec9df56e`
3. 云函数目录结构是否正确

---

**注意：必须先部署云函数，才能使用 GitHub 注册功能！**
